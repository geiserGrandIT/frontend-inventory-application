const Debug = true;
export const baseURL = () => {
    if (Debug){
        let ip =window.location.href;
        
        const hostName = ip.split("/")
        const address = "http://"+hostName[2]+":8000/"
        
        return address;
    }
}
