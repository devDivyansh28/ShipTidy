import { ArrowSquareDownIcon } from "@phosphor-icons/react";
import { NextRequest } from "next/server";
import { getGithubApp } from "../utils/github-app";
import { error } from "console";
import { savePullRequest } from "@/features/reviews/server/save-pull-request";
import { inngest } from "@/features/inngest/client";

const REVIEWABLE_ACTIONS=["opened","synchronize","reopened"];

export type PullRequestWebhookPayload = {
  /** Webhook action, e.g. `opened`, `synchronize`, `reopened` */
  action: string;
  /** GitHub App installation that received the event */
  installation: { id: number };
  repository: { full_name: string };
  pull_request: {
    number: number;
    title: string;
    user: { login: string } | null;
    head: { sha: string };
    base: { ref: string };
  };
};


export async function handleGithubWebhook(request:Request){
    const payload = await request.text();
    const signature = request.headers.get("x-hub-signature-256");
    const eventName = request.headers.get("x-github-event");


    const isValid = await isSignatureValid(payload , signature);

    if(!isValid){
        return Response.json({error: "Invalid Signature"} , {status: 401});
    }

    if(eventName !== "pull_request"){
        return Response.json({received: true});
    }

    const event = JSON.parse(payload) as PullRequestWebhookPayload;
    console.log("event" , event);
    if(!REVIEWABLE_ACTIONS.includes(event.action)){
        return Response.json({received: true});
    }

    const pullRequest = await savePullRequest(event);
    // Todo Map Github installation id

    // Background job of reviewing

    await inngest.send({
        name: "github/pr.received",
        data: {pullRequestId: pullRequest.id},
    })

    return Response.json({received: true});


}

async function isSignatureValid(payload:string , signature:string | null){
    if(!signature){
        return false;
    }

    const app = getGithubApp();

    return app.webhooks.verify(payload , signature);
}