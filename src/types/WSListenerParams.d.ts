export interface wsAuthenticateParams {
    email: string;
    type: "PAT" | "CON" | "PHY";
    token: string;
}
