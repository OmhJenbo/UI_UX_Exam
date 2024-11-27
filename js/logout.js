//Logs user out
export const logout = () => {
    sessionStorage.removeItem("userEmail", email);
    window.location.href = "index.html";
}