import { inngest } from "@/features/inngest/client";
import { prisma } from "@/lib/db";
import { formatPrFilesForReview, getPullRequestFiles } from "./pr-files";
import { chunkPrFiles } from "../utils/chunk-code";
import { generateReview } from "./generate-review";
import { postPrComment } from "./post-pr-comment";

export const reviewPullRequest = inngest.createFunction(
    {id: "review-pull-request" , triggers: {event: "github/pr.received"}},
    async ({event , step})=>{
        const pullRequestId = event.data.pullRequestId;

        const pullRequest = await step.run("mark-processing",async()=>{
            return prisma.pullRequest.update({
                where: {
                    id: pullRequestId
                },
                data: {
                    status: "processing"
                }
            })
        })

        const diff = await step.run("fetch-pr-diff" , async ()=>{
             const files = await getPullRequestFiles(
               pullRequest.installationId,
               pullRequest.repoFullName,
               pullRequest.prNumber,
             );

             return formatPrFilesForReview(files);
        });

        if(!diff.trim()){
           await step.run("mark-review-no-code", async () => {
             await prisma.pullRequest.update({
               where: { id: pullRequestId },
               data: { status: "reviewed" },
             });
           });
           return {
             pullRequestId,
             status: "reviewed",
             reason: "no code to review",
           };
        }

        const chunks = await step.run("break-down-code" ,async()=>{
            const files = await getPullRequestFiles(
                pullRequest.installationId,
                pullRequest.repoFullName,
                pullRequest.prNumber
            );

            return chunkPrFiles(pullRequest.prNumber , files);
        })

        // if(chunks.length===0){
        //     await step.run("mark-review-no-code" , async()=>{
        //         await prisma.pullRequest.update({
        //             where: {id: pullRequestId},
        //             data: {status:  "reviewed"},
        //         })
        //     });
        //     return { pullRequestId ,status: "reviewed" , reason: "no code to review"};
        // }

        // // Todo: pr namespace isolates this diff from other prs and from repo-wide sync data (add for pinecone db)

        // await step.sleep("wait for vector to index","10s");


        const review = await step.run("generate-ai-review",async()=>{
            return generateReview({
                repoFullName: pullRequest.repoFullName,
                title: pullRequest.title,
                diff
            })
        });

        await step.run("post-pr-comment" , async()=>{
            await postPrComment(
                pullRequest.installationId,
                pullRequest.repoFullName,
                pullRequest.prNumber,
                review
            )
        })
        

        await step.run("mark-reviewd" , async ()=>{
            await prisma.pullRequest.update({
                where: {id: pullRequestId},
                data: {
                    status: "reviewed",
                    reviewComment: review,
                    reviewedAt: new Date(),
                }
            })
        })


    }
)