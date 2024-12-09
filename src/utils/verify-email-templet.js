export const verificationEmailTemplete = (name, link) => {
    return `
            <h1>Hi ${name}</h1>
            <p>Click the link below to verify your email</p>
            <a href=${link}>Verify your Email</a>
        `;
};