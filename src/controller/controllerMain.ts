import { data, dataUser } from "../DataType";
import { supabase } from "../config/config";
import fs from "fs";
import path from "path";

export class classTest1 {
  async FindMean(_Data: data) {
    try {
      if (_Data.x.length > 0) {
        if (_Data.w.length > 0) {
          const xTotal = _Data.x.reduce(
            (a, b, index) => a + b * _Data.w[index],
            0
          );
          const wTotal = _Data.w.reduce((a, b) => a + b, 0);
          const sumAverage = xTotal / wTotal;
          return sumAverage.toFixed(2);
        } else {
          const sum = _Data.x.reduce((a, b) => a + b, 0);
          return (sum / _Data.x.length).toFixed(2);
        }
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
}

export class classTest2 {
  async GetUser(UserID: string) {
    try {
      const { data, error } = await supabase
        .from("user_details_view")
        .select(
          `
          UserName,
          UserID,
          Mail,
          FirstName,
          LastName,
          PhoneNumber,
          BirthDate,
          Age,
          Role,
          Verify
        `
        )
        .eq("UserID", UserID)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        console.log("No data found for UserID:", UserID);
        return { status: 404, message: "User not found" };
      }

      return data;
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  async CreateUser(_Data: dataUser) {
    try {
      const { data, error } = await supabase
        .from("UserDetails")
        .insert([
          {
            FirstName: _Data.FirstName,
            LastName: _Data.LastName,
            PhoneNumber: _Data.PhoneNumber,
            BirthDate: _Data.BirthDate
          }
        ])
        .select("id, FirstName, LastName, PhoneNumber, BirthDate");
      if (error) {
        console.error("Error inserting data:", error);
        return { status: 500, message: "Internal server error" };
      }
      const GetUserDetail_ID = data[0].id;
      if (GetUserDetail_ID) {
        const { data , error } = await supabase.from("Account").insert([
          {
            UserName: _Data.UserName,
            UserID: _Data.UserID,
            Password: _Data.Password,
            Mail: _Data.Mail,
            Role: _Data.Role,
            Verify: false,
            UserDetail_ID: GetUserDetail_ID
          }
        ])
        .select("UserName, UserID, Mail, Role, Verify, UserDetail_ID");
        if (error) {
          console.error("Error inserting data:", error);
          return { status: 500, message: "Internal server error" };
        }
        else{
          return { status: 200, message: `User ${data[0].UserName} created successfully` };
        }
      }

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
}
