const Debug = true;
export const baseURL = () => {
    if (Debug){

        const address = "http://"+"ims.geisergrand.com"+":8000/"
        
        return address;
    }
}
