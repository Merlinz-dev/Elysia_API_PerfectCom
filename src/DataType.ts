export interface data {
  // x: Array<{
  //   EffectiveDate: string;
  //   EndEffectiveDate: string;
  //   Biz: string;
  //   Target: number;
  //   Target_Group: string;
  //   Target_Type: string;
  // }>;
  x : number[]
  w : number[]
}

export interface dataUser {
  UserName : string;
  UserID : string;
  Password : string;
  Mail : string;
  Role : string;
  Verify : boolean;
  UserDetail_ID : string;
  FirstName : string;
  LastName : string;
  PhoneNumber : string;
  BirthDate : string;
}