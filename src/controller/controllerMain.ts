import { t } from "elysia";
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
  // *************** No DB ***************
  private userDatabase: Map<string, dataUser> = new Map();

  async GetUser_NoDB(UserID: string) {
    try {
      const user = this.userDatabase.get(UserID);

      if (!user) {
        // console.log("No data found for UserID:", UserID);
        return { status: 404, message: "User not found" };
      }

      return { status: 200, data: user };
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }

  async CreateUser_NoDB(_Data: dataUser) {
    try {
      const userDetailID = Math.random().toString(36).substr(2, 9);

      const user = {
        UserName: _Data.UserName,
        UserID: _Data.UserID,
        Mail: _Data.Mail,
        FirstName: _Data.FirstName,
        LastName: _Data.LastName,
        PhoneNumber: _Data.PhoneNumber,
        BirthDate: _Data.BirthDate,
        Role: _Data.Role,
        Password: _Data.Password,
        Verify: false,
        UserDetail_ID: userDetailID
      };

      this.userDatabase.set(_Data.UserID, user);

      return {
        status: 200,
        message: `User ${_Data.UserName} created successfully`
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return { status: 500, message: "Internal server error" };
    }
  }

  async Update_UserDetails_NoDB(_Data: dataUser) {
    try {
      const user = this.userDatabase.get(_Data.UserID);

      if (!user) {
        return { status: 404, message: "User not found" };
      }

      user.FirstName = _Data.FirstName;
      user.LastName = _Data.LastName;
      user.PhoneNumber = _Data.PhoneNumber;
      user.BirthDate = _Data.BirthDate;

      return {
        status: 200,
        message: `User ${user.UserName} updated successfully`
      };
    } catch (error) {
      console.error("Error updating user:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  async Delete_User_NoDB(UserID: string) {
    try {
      const user = this.userDatabase.get(UserID);

      if (!user) {
        return { status: 404, message: "User not found" };
      }

      this.userDatabase.delete(UserID);

      return {
        status: 200,
        message: `User ${user.UserName} deleted successfully`
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { status: 500, message: "Internal server error" };
    }
  }

  // *************** Supabase ***************
  async GetUser(UserID: string) {
    try {
      const data = supabase("user_details_view")
        .select(
          "UserName",
          "UserID",
          "Mail",
          "FirstName",
          "LastName",
          "PhoneNumber",
          "BirthDate",
          "Age",
          "Role",
          "Verify"
        )
        .where("UserID", UserID);

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
      const data = await supabase("UserDetails").insert(
        {
          FirstName: _Data.FirstName,
          LastName: _Data.LastName,
          PhoneNumber: _Data.PhoneNumber,
          BirthDate: _Data.BirthDate
        },
        ["id", "FirstName", "LastName", "PhoneNumber", "BirthDate"]
      );

      if (data) {
        const GetUserDetail_ID = data[0].id;
        const result = await supabase("Account").insert(
          {
            UserName: _Data.UserName,
            UserID: _Data.UserID,
            Password: _Data.Password,
            Mail: _Data.Mail,
            Role: _Data.Role,
            Verify: false,
            UserDetail_ID: GetUserDetail_ID
          },
          "UserName"
        );
        if (result) {
          return {
            status: 200,
            message: `User ${result[0].UserName} created successfully`
          };
        } else {
          return { status: 500, message: "Internal server error" };
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  async Update_UserDetails(_Data: dataUser) {
    try {
      const result = await supabase("Account")
        .select("UserDetail_ID")
        .where("UserID", _Data.UserID);

      if (result) {
        const UserDetail_ID = result[0].UserDetail_ID;
        const result2 = await supabase("UserDetails")
          .update({
            FirstName: _Data.FirstName,
            LastName: _Data.LastName,
            PhoneNumber: _Data.PhoneNumber,
            BirthDate: _Data.BirthDate
          })
          .where("id", UserDetail_ID);

        if (result2) {
          return {
            status: 200,
            message: ` updated successfully`
          };
        } else {
          return { status: 500, message: "Internal server error" };
        }
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  async Delete_User(UserID: string) {
    try {
      const result = await supabase("Account")
        .select("UserDetail_ID")
        .where("UserID", UserID);

      if (result) {
        const UserDetail_ID = result[0].UserDetail_ID;
        const result2 = await supabase("UserDetails")
          .delete()
          .where("id", UserDetail_ID);

        const result3 = await supabase("Account")
          .delete()
          .where("UserID", UserID);

        if (result2 && result3) {
          return {
            status: 200,
            message: `User deleted successfully`
          };
        } else {
          return { status: 500, message: "Internal server error" };
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
}
