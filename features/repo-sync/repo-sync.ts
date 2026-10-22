import {redirect} from "next/navigation";
import {getServerSession} from "../auth/actions";
import


export async function syncRepoCodebase(repoFullName:string , branch: string) {
    const session = await getServerSession();

    if(!session){
        redirect("./sign-in");
    }
    
    const installationId = await get
}