
class Organization {
    httpStatusCode:number = 0;
    data:{
        id:string;
        org_name:string
    }={
        id:"",
        org_name: ""
    }
}

class Region {
    httpStatusCode:number = 0;
    data:{
        id:string,
        region_name:string
    } = {
        id:"",
        region_name:""
    }
}


export class Profile {
    organizations:Organization[] = [];
    regions: Region[] = []
}