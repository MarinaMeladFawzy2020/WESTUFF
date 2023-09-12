export interface Module {
  id?:number;
  moduleName?: string; 
 
  roles?: Roles[]; 
  
}
export interface Roles {
 id?:number;
 roleName:string;
}