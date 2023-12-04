const Debug = true;
const baseURL = () => {
    if (Debug){

        const address = "http://"+"ims.geisergrand.com"+":8000/"
        
        return address;
    }
}
const isMobile = () =>{

}
export {isMobile, baseURL}