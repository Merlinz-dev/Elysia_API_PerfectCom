import {
  db_CFSMART,
  db_STU,
  db_EMS,
  db_SMLD,
  db_QMS,
  db_SFG,
  db_QMS_SMLD,
} from "../config/config";
import { dataDashboard } from "../DataType";
import { getCurrentDateTimeInBangkok } from "../date_Bangkok";
import { MockupData_4MChange } from "../../Asset/Quality/MockupData/4MChange";
import {
  startOfWeek,
  endOfWeek,
  parseISO,
  format,
  addWeeks,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { dataQASampling } from "../DataType";

interface ParameterData {
  Table_Name: string;
  Parameter: string[];
}

interface APIResponse {
  status: number;
  message?: string;
  data?: ParameterData[];
}

export class classDashboardQuality {
  async GetDashboard_Quality(_Data: dataDashboard) {
    try {
      const query = db_CFSMART("MST_WEB_MENU")
        .select(
          "Web_Page",
          "Web_Group",
          "Web_Name",
          "Web_URL",
          "Web_IconURL",
          "Display_OrderX",
          "Display_OrderY",
          "Display_OrderSeq",
          "Display_Owner",
          "Update_Date",
          "Role",
          "Update_By"
        )
        .where("Web_Page", _Data.Web_Page)
        .orderBy("Display_OrderY")
        .orderBy("Display_OrderX")
        .orderBy("Display_OrderSeq");

      if (_Data.Display_Owner === "Select") {
        query.whereIn("Display_Owner", ["Default", "Slide"]);
      } else {
        query.where("Display_Owner", _Data.Display_Owner);
      }

      // Add additional condition when Display_Owner is 'Default'
      if (_Data.Display_Owner === "Default") {
        query.whereNot("Role", "Select");
      }

      const result = await query;

      if (result.length > 0) {
        return result;
      } else {
        return { status: 404, message: "Record not found" };
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }

  async SaveUserSetting(_Data: dataDashboard) {
    const queryStringDelete = `DELETE FROM MST_WEB_MENU WHERE Web_Page = '${_Data.Web_Page}' AND Display_Owner = '${_Data.UserID}'`;
    await db_CFSMART.raw(queryStringDelete);
    // console.log(queryStringDelete);

    const insertPromises = _Data.InsertData.map((item) => {
      const queryStringInsert = `INSERT INTO MST_WEB_MENU 
            (Web_Page, Web_Group, Web_Name, Web_URL, Web_IconURL, Display_OrderX, Display_OrderY, Display_OrderSeq, Display_Owner, Update_Date, Update_By) 
            VALUES ('${_Data.Web_Page}', '${item.Web_Group}', '${item.Web_Name}', '${item.Web_URL}', '${item.Web_IconURL}', ${item.Display_OrderX}, ${item.Display_OrderY}, ${item.Display_OrderSeq}, '${item.Display_Owner}', GetDate(), '${item.Update_By}')`;

      return db_CFSMART.raw(queryStringInsert);
    });

    await Promise.all(insertPromises);
    // console.log("Done");
    return { message: "Data Updated" };
  }
  async GetStartUpCheck_Dashboard() {
    const date_Bangkok = getCurrentDateTimeInBangkok();
    const currentDate = date_Bangkok.split(" ")[0]; // เอาเฉพาะวันที่
    const currentHour = Number(date_Bangkok.split(" ")[1].split(":")[0]); // เอาเฉพาะชั่วโมงแล้วแปลงเป็นตัวเลข
    const SHIFT = currentHour >= 8 && currentHour < 19 ? "DAY" : "NIGHT";

    const queryString = `SELECT Biz_Group, SUM(COMPLETE) AS Actual , SUM(Total_Line) AS  Target
                                FROM (
                                SELECT v2.Biz_Group, v2.Total_Line, COALESCE((v1.COMPLETE), 0) AS COMPLETE
                                    FROM (
                                    SELECT 
                                    CASE 
                                        WHEN LINE = 'P02' THEN 'P01' 
                                        ELSE LINE 
                                    END AS LINE  
                                    , SHIFT, PERIOD, STATUS, DATETIME2,
                                            CASE 
                                            WHEN (STATUS = 'RUN' AND CONFIRM2 IS NOT NULL) OR STATUS != 'RUN' THEN 1 
                                            ELSE 0 
                                        END AS COMPLETE,
                                            CASE 
                                            WHEN STATUS = 'RUN' AND CONFIRM2 IS NULL THEN 1 
                                            ELSE 0 
                                        END AS NOT_COMPLETE
                                        FROM
                                            StartUpCheck_Time
                                        WHERE 
                                        SHIFT_DATE = '${currentDate}'
                                            AND PERIOD = 'SHIFT'
                                            AND SHIFT = '${SHIFT}'
                                ) AS v1
                                        RIGHT JOIN (
                                    SELECT Biz_Group, COUNT(*) AS Total_Line , Line_Name
                                        FROM MST_LINE
                                        GROUP BY Biz_Group,Line_Name
                                ) AS v2
                                        ON v1.LINE = v2.Line_Name
                                ) AS v3
                                GROUP BY Biz_Group
                            `;
    const result = await db_STU.raw(queryString);
    return await result;
  }

  async GetMDC_Dashboard() {
    const date_Bangkok = getCurrentDateTimeInBangkok();
    const currentDate = date_Bangkok.split(" ")[0]; // เอาเฉพาะวันที่
    const queryString = `SELECT  v2.BIZ_CD,ISNULL(MDC_CMP,0) AS MDC_CMP,ISNULL(MDC_TTL,0) AS MDC_TTL
                            FROM
                              (SELECT  distinct Biz_Group AS BIZ_CD
                              FROM MST_LINE with(nolock)) v2
                              left join
                              (SELECT  BIZ_CD,SUM(MDC_CMP) AS MDC_CMP,SUM(MDC_TTL) AS MDC_TTL
                              FROM
                                (SELECT  t2.Biz_Group AS BIZ_CD,0 AS MDC_CMP,COUNT(ID) As MDC_TTL
                                FROM  StartupModelChange t1 with(nolock) inner join
                                    MST_LINE t2 on t2.Line_Name=t1.Line_Name
                                where Date_CD='${currentDate
        .split("-")
        .join("")}'
                                GROUP BY t2.Biz_Group
                                UNION
                                SELECT   t2.Biz_Group AS BIZ_CD,COUNT(ID) AS MDC_CMP,0 As MDC_TTL
                                FROM  StartupModelChange t1 with(nolock) inner join
                                  MST_LINE t2 on t2.Line_Name=t1.Line_Name
                                where Date_CD='${currentDate
        .split("-")
        .join("")}'
                                  and Check_Result='OK'
                                GROUP BY t2.Biz_Group) v1
                              GROUP BY BIZ_CD) v11 on v11.BIZ_CD=v2.BIZ_CD
                          ORDER BY v2.BIZ_CD
                            `;
    const result = await db_STU.raw(queryString);
    return await result;
  }
  async GetESD_Dashboard(_Supporter_Flag: number) {
    // console.log(_Supporter_Flag);
    const date_Bangkok = getCurrentDateTimeInBangkok();
    const currentHour = Number(date_Bangkok.split(" ")[1].split(":")[0]); // เอาเฉพาะชั่วโมงแล้วแปลงเป็นตัวเลข
    const SHIFT = currentHour >= 8 && currentHour < 19 ? "D" : "N";

    const queryString = `SELECT Work_Area,
                        SUM(Shoes_OnlyEsd) AS S_CHK,
                        SUM(Shoes_Only) AS S_TTL,
                        SUM(Shoes_WristrapEsd) AS WS_CHK,
                        SUM(Shoes_Wristrap) AS WS_TTL
                  FROM (
                      SELECT v1.Employee_ID,
                            t1.Shift_CD,
                            Work_Area,
                            Shoes_Only,
                            Shoes_OnlyEsd,
                            Shoes_Wristrap,
                            Shoes_WristrapEsd
                      FROM EMS.MasterShift t1 WITH (NOLOCK)
                      INNER JOIN (
                          SELECT e1.Employee_ID,
                                Shift_CD,
                                Work_Area,
                                0 AS Shoes_Only,
                                0 AS Shoes_OnlyEsd,
                                1 AS Shoes_Wristrap,
                                ISNULL(ESD_Check, 0) AS Shoes_WristrapEsd
                          FROM EMS.EmployeeGroupESD e1 WITH (NOLOCK)
                          LEFT OUTER JOIN (
                              SELECT DISTINCT EmployeeID AS Employee_ID, 
                                              1 AS ESD_Check
                              FROM EMS.AttendanceGateESD WITH (NOLOCK)
                              WHERE PassTime > DATEADD(hour, -12, GETDATE())
                          ) e2 ON e2.Employee_ID = e1.Employee_ID
                          INNER JOIN (
                              SELECT DISTINCT EmployeeID
                              FROM EMS.AttendanceGate
                              WHERE Create_Date >= CAST(GETDATE() AS DATE)
                          ) ag ON ag.EmployeeID = e1.Employee_ID
                          WHERE Check_Mode = 'SW' AND Flag_Supporter = '${_Supporter_Flag}'
                          UNION
                          SELECT e1.Employee_ID,
                                Shift_CD,
                                Work_Area,
                                1 AS Shoes_Only,
                                ISNULL(ESD_Check, 0) AS Shoes_OnlyEsd,
                                0 AS Shoes_Wristrap,
                                0 AS Shoes_WristrapEsd
                          FROM EMS.EmployeeGroupESD e1 WITH (NOLOCK)
                          LEFT OUTER JOIN (
                              SELECT DISTINCT EmployeeID AS Employee_ID, 
                                              1 AS ESD_Check
                              FROM EMS.AttendanceGateESD WITH (NOLOCK)
                              WHERE PassTime > DATEADD(hour, -12, GETDATE())
                          ) e2 ON e2.Employee_ID = e1.Employee_ID
                          WHERE Check_Mode <> 'SW' AND Flag_Supporter = '${_Supporter_Flag}'
                      ) v1 ON t1.Shift_CD = v1.Shift_CD
                      WHERE t1.Shift_WorkCD = '${SHIFT}'
                  ) vv1
                  GROUP BY Work_Area;
                            `;
    // const queryString = `select Work_Area,SUM(Shoes_WristrapEsd) As S_CHK,SUM(Shoes_Wristrap) As S_TTL,SUM(Shoes_OnlyEsd) As WS_CHK, SUM(Shoes_Only) As WS_TTL
    //                       from
    //                         (select v1.Employee_ID,t1.Shift_CD,Work_Area,Shoes_Wristrap,Shoes_WristrapEsd,Shoes_Only,Shoes_OnlyEsd
    //                         from
    //                           MasterShift t1 with(nolock) inner join
    //                           (select e1.Employee_ID,Shift_CD,Work_Area,0 As Shoes_Wristrap,0 As Shoes_WristrapEsd,1 As Shoes_Only,ISNULL(ESD_Check,0) As Shoes_OnlyEsd
    //                           from EmployeeGroupESD e1 with(nolock) left outer join
    //                             (select distinct EmployeeID As Employee_ID,1 As ESD_Check
    //                             from AttendanceGateESD with(nolock)
    //                             where PassTime>dateadd(hour,-12,getdate())) e2 on e2.Employee_ID=e1.Employee_ID
    //                           where Check_Mode='SW' and Flag_Supporter= '${_Supporter_Flag}'
    //                           UNION
    //                           select e1.Employee_ID,Shift_CD,Work_Area,1 As Shoes_Wristrap,ISNULL(ESD_Check,0) As Shoes_WristrapEsd,0 As Shoes_Only,0 As Shoes_OnlyEsd
    //                           from EmployeeGroupESD e1 with(nolock) left outer join
    //                             (select distinct EmployeeID As Employee_ID,1 As ESD_Check
    //                             from AttendanceGateESD with(nolock)
    //                             where PassTime>dateadd(hour,-12,getdate())) e2 on e2.Employee_ID=e1.Employee_ID
    //                           where Check_Mode<>'SW'and Flag_Supporter= '${_Supporter_Flag}'
    //                           ) v1 on t1.Shift_CD=v1.Shift_CD
    //                         where t1.Shift_WorkCD= '${SHIFT}'
    //                         ) vv1
    //                       group by Work_Area
    //                         `;
    // console.log(queryString);

    const result = await db_EMS.raw(queryString);
    return await result;
  }
  async GetSMLD_Mastertarget(Web_Type: string) {
    let queryString = "";
    switch (Web_Type) {
      case "Chart":
        queryString = `select ID,Business, SPI_FPYL, SPI_RFYL, SPI_RYL, BRI_FPYL, BRI_RFYL, BRI_RYL, ARI_FPYL, ARI_RFYL, ARI_RYL, VI_KPI
        from TBL_SMLD_TARGET  order by ID `;
      case "SetMaster":
        queryString = `select ID,Business, SPI_KPI, SPI_FPYL, SPI_RFYL, SPI_RYL, BRI_KPI, BRI_FPYL, BRI_RFYL, BRI_RYL, ARI_KPI, ARI_FPYL, ARI_RFYL, ARI_RYL, VI_KPI
        from TBL_SMLD_TARGET order by ID`;
      case "Dashboard":
        queryString = `select  ID,Business, SPI_KPI, SPI_FPYL, SPI_RFYL, SPI_RYL, BRI_KPI, BRI_FPYL, BRI_RFYL, BRI_RYL, ARI_KPI, ARI_FPYL, ARI_RFYL, ARI_RYL, VI_KPI
        from TBL_SMLD_TARGET  order by ID`;
      default:
        queryString = `select  ID,Business, SPI_KPI, SPI_FPYL, SPI_RFYL, SPI_RYL, BRI_KPI, BRI_FPYL, BRI_RFYL, BRI_RYL, ARI_KPI, ARI_FPYL, ARI_RFYL, ARI_RYL, VI_KPI
        from TBL_SMLD_TARGET  order by ID`;
    }
    // console.log(queryString);
    const result = await db_SMLD.raw(queryString);
    return await result;
  }

  async INSERT_SMLD_TABLE(_Data: dataDashboard) {
    try {
      await db_SMLD("TBL_SMLD_TARGET").delete();

      const insertPromises = _Data.InsertTable.map((item) => {
        return db_SMLD("TBL_SMLD_TARGET").insert({
          Business: item.Business,
          SPI_KPI: item.SPI_KPI,
          SPI_FPYL: item.SPI_FPYL,
          SPI_RFYL: item.SPI_RFYL,
          SPI_RYL: item.SPI_RYL,
          BRI_KPI: item.BRI_KPI,
          BRI_FPYL: item.BRI_FPYL,
          BRI_RFYL: item.BRI_RFYL,
          BRI_RYL: item.BRI_RYL,
          ARI_KPI: item.ARI_KPI,
          ARI_FPYL: item.ARI_FPYL,
          ARI_RFYL: item.ARI_RFYL,
          ARI_RYL: item.ARI_RYL,
          VI_KPI: item.VI_KPI,
        });
      });
      await Promise.all(insertPromises);

      return { status: 200, message: "Data Updated" };
    } catch (error) {
      console.error("Error Insert Data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }

  async UpdateSMLD_Mastertarget(_Data: dataDashboard) {
    try {
      // console.log(_Data)
      const result = await db_SMLD("TBL_SMLD_TARGET")
        .where("Business", _Data.Business)
        .update({
          SPI_KPI: _Data.SPI_KPI,
          SPI_FPYL: _Data.SPI_FPYL,
          SPI_RFYL: _Data.SPI_RFYL,
          SPI_RYL: _Data.SPI_RYL,
          BRI_KPI: _Data.BRI_KPI,
          BRI_FPYL: _Data.BRI_FPYL,
          BRI_RFYL: _Data.BRI_RFYL,
          BRI_RYL: _Data.BRI_RYL,
          ARI_KPI: _Data.ARI_KPI,
          ARI_FPYL: _Data.ARI_FPYL,
          ARI_RFYL: _Data.ARI_RFYL,
          ARI_RYL: _Data.ARI_RYL,
          VI_KPI: _Data.VI_KPI,
        });
      // console.log(result);
      if (result) {
        return { status: 200, message: "Update successful" };
      } else {
        return { status: 404, message: "Record not found" };
      }
    } catch (error) {
      console.error("Error updating data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }

  async GetQASampling_Dashboard() {
    const date_Bangkok = getCurrentDateTimeInBangkok();
    const datePart = date_Bangkok.split(" ")[0]; // Extract the date part
    const fixedDateTime = datePart.replace(/-/g, "/"); // Replace '-' with '/'
    const currentDate = `${fixedDateTime}`; // Fix the time to 08:00:00

    const queryString = `
						SELECT 
							p1.BIZ, 
							ISNULL(p2.Target, 0) AS Target,
							 CASE 
								WHEN ISNULL(p2.Result_OK, 0) - ISNULL(B2.Result_NG, 0) < 0 THEN 0
								ELSE ISNULL(p2.Result_OK, 0) - ISNULL(B2.Result_NG, 0)
							END AS Result_OK,
							ISNULL(B2.Result_NG, 0) AS Result_NG, -- Integrated Result_NG from the second query
							ISNULL(p2.In_Progress, 0) AS In_Progress
						FROM (
							SELECT DISTINCT 
								CASE 
									WHEN MRP = 'RMYW' OR MAIN_BIZ = 'FORD' OR MAIN_BIZ = 'BRANDING' THEN 'LF' 
									WHEN WORKSHOP = 'AYZ' AND CATEGORY = 'IM-IMAGER' THEN 'KDV' 
									WHEN CATEGORY IN ('CL_FLEX', 'LSV lens') THEN 'LENS' 
									WHEN MAIN_BIZ IN ('SMA', 'Mobile', 'Mobile Phone') THEN 'MC' 
									ELSE MAIN_BIZ 
								END AS BIZ
							FROM KOMPAS_BOARD_MASTER
							WHERE MAIN_BIZ NOT IN ('SDT', 'THAI WHETRON', 'MC', 'SMA', 'Mobile', 'Mobile Phone')
						) p1
						LEFT JOIN (
							SELECT 
								BIZ,
								SUM(In_Progress) + SUM(Result_OK) AS Target,
								SUM(Result_OK) AS Result_OK,
								SUM(In_Progress) AS In_Progress
							FROM (
								SELECT 
									q1.PlanID,
									BoardName,
									PartNo,
									Sampling_Target,
									Sampling_Qty,
									CASE 
										WHEN kb.MRP = 'RMYW' OR kb.MAIN_BIZ = 'FORD' THEN 'LF' 
										WHEN kb.WORKSHOP = 'AYZ' AND kb.CATEGORY = 'IM-IMAGER' THEN 'KDV' 
										WHEN kb.CATEGORY IN ('CL_FLEX', 'LSV lens') THEN 'LENS' 
										WHEN kb.MAIN_BIZ IN ('SMA', 'Mobile', 'Mobile Phone') THEN 'MC' 
										ELSE kb.MAIN_BIZ 
									END AS BIZ,
									CASE 
										WHEN q1.Flag_Sampling = 0 THEN 1 
										ELSE 0 
									END AS In_Progress,
									CASE 
										WHEN q1.Flag_Sampling = 1 THEN 1 
										ELSE 0 
									END AS Result_OK,
									q1.Lock_Date,
									CONVERT(VARCHAR(10), q1.Lock_Date, 111) AS Date_DC
								FROM QA_Sampling_State q1
								INNER JOIN SIGMA_KEIMST kst ON kst.RECID = q1.PlanID
								INNER JOIN KOMPAS_BOARD_MASTER kb ON kb.MODEL = kst.KISHNAME
								WHERE q1.Flag_Sampling < 2 AND q1.Flag_Delete = 0 AND PartNo IS NOT NULL
							) AS q1
							GROUP BY BIZ
						) p2 ON p1.BIZ = p2.BIZ
						LEFT JOIN (
							SELECT BIZ, SUM(CASE WHEN Criteria = 1 THEN 1 ELSE 0 END) AS Result_NG
							FROM [SFG].[QA_LeakState]
							WHERE FoundDate = '${currentDate}'
							GROUP BY BIZ
						) B2 ON p1.BIZ = B2.BIZ
ORDER BY p1.BIZ;`;
    const result = await db_SFG.raw(queryString);
    return await result;
  }
  async GetLAR_Dashboard() {
    const queryString = `
    SELECT  BIZ
      ,0 AS Target
      ,Actual_FY
      ,Actual_Month
      ,Actual_Today
      FROM V_LAR_DASHBOARD`;
    const result = await db_SFG.raw(queryString);
    return await result;
  }

  async GetLAR_Target() {
    const queryString = `
            select BIZ,Target 
            FROM [QMS].[V_LAR_Target]`;
    const result = await db_QMS.raw(queryString);
    return await result;
  }

  //GET MST BIZ
  async MST_BIZ() {
    try {
      const result = await db_SFG("V_QA_Sampling")
        .distinct("BIZ")
        .where("BIZ", "!=", "")
        .orderBy("BIZ");
      return result;
    } catch (error) {
      console.error("Error updating data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  //GET EMPLOYEE
  async GET_EMPLOYEE() {
    try {
      const result = await db_SFG("V_QA_Sampling")
        .distinct("Sampling_By")
        .where("Sampling_By", "!=", "")
        .orderBy("Sampling_By");
      return result;
    } catch (error) {
      console.error("Error updating data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  //_Data: dataDashboard
  async GetSamplingTable() {
    const queryString = `
     SELECT *
     FROM V_QA_Sampling
        `;
    const result = await db_SFG.raw(queryString);
    return await result;
  }
  async InsertAlert(_Data: dataDashboard, UserID: string) {
    try {
      // console.log(_Data);
      const getOldAlert = await db_QMS("QualtyDashboardNotify")
        .select(
          "ID",
          "Function_Name",
          "Parameter_Name",
          "Notify_Message",
          "Notify_Level",
          "Create_Date",
          "Create_By"
        )
        .where("Function_Name", _Data.Function_Name)
        .where("Parameter_Name", _Data.Parameter_Name);
      if (getOldAlert.length > 0) {
        if (
          getOldAlert[0].Notify_Level < _Data.Notify_Level ||
          (getOldAlert[0].Create_By === "999" && _Data.UserID !== 999)
        ) {
          // console.log(
          //   "Create_By",
          //   getOldAlert[0].Create_By,
          //   "Type:",
          //   typeof getOldAlert[0].Create_By
          // );
          // console.log("UserID", _Data.UserID, "Type:", typeof _Data.UserID);

          await db_QMS("QualtyDashboardNotify")
            .where("ID", getOldAlert[0].ID)
            .del();
          const result = await db_QMS("QualtyDashboardNotify").insert(
            {
              Function_Name: _Data.Function_Name,
              Parameter_Name: _Data.Parameter_Name,
              Notify_Message: _Data.Notify_Message,
              Notify_Level: _Data.Notify_Level,
              Create_By: UserID,
            },
            ["ID"]
          );
          if (result.length > 0) {
            return { status: 200, message: "Data Insert Done" };
          } else {
            return { status: 500, message: "Internal server error" };
          }
        } else {
          return { status: 200, message: "Data Already Insert" };
        }
      } else {
        const result = await db_QMS("QualtyDashboardNotify").insert(
          {
            Function_Name: _Data.Function_Name,
            Parameter_Name: _Data.Parameter_Name,
            Notify_Message: _Data.Notify_Message,
            Notify_Level: _Data.Notify_Level,
            Create_By: UserID,
          },
          ["ID"]
        );
        if (result.length > 0) {
          return { status: 200, message: "Data Insert Done" };
        } else {
          return { status: 500, message: "Internal server error" };
        }
      }
    } catch (error) {
      console.error("Error Insert Data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  async GetAlert(Function_Name: string) {
    try {
      const result = await db_QMS("QualtyDashboardNotify")
        .select(
          "ID",
          "Function_Name",
          "Parameter_Name",
          "Notify_Message",
          "Notify_Level",
          "Create_Date",
          "Create_By"
        )
        .where("Function_Name", Function_Name)
        .orderBy("Notify_Level", "desc")
        .orderBy("Create_Date");
      if (result) {
        return result;
      } else {
        return { status: 404, message: "Record not found" };
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  async DeleteAlert(_Data: dataDashboard) {
    try {
      const result = _Data.DeleteAlertData.map((item) => {
        return db_QMS("QualtyDashboardNotify")
          .where("Function_Name", item.Function_Name)
          .where("Parameter_Name", item.Parameter_Name)
          .del();
      });
      await Promise.all(result);
      if (result) {
        return { status: 200, message: "Data Deleted" };
      } else {
        return { status: 404, message: "Record not found" };
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  // Function to get parameters and map to the desired structure
  async GetAlertParameters(): Promise<APIResponse> {
    try {
      // Query from the database
      const result = await db_QMS("QualityDashboardParameter")
        .select("Table_Name", "Parameter")
        .orderBy("Table_Name")
        .orderBy("Parameter");

      if (result.length === 0) {
        return { status: 404, message: "Record not found" };
      }

      // Map and group the data by Table_Name using reduce
      const AlertParameter = result.reduce(
        (
          acc: ParameterData[],
          curr: { Table_Name: string; Parameter: string }
        ) => {
          const foundItem = acc.find(
            (item) => item.Table_Name === curr.Table_Name
          );

          if (foundItem) {
            foundItem.Parameter.push(curr.Parameter);
          } else {
            acc.push({
              Table_Name: curr.Table_Name,
              Parameter: [curr.Parameter],
            });
          }
          return acc;
        },
        []
      );

      return AlertParameter;
    } catch (error) {
      console.error("Error fetching AlertParameters:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  async Dashboard_4MChange() {
    try {
      return MockupData_4MChange;
    } catch (error) {
      console.error("Error updating data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  async GetAllAlert() {
    try {
      const result = await db_QMS("QualtyDashboardNotify")
        .select(
          "ID",
          "Function_Name",
          "Parameter_Name",
          "Notify_Message",
          "Notify_Level",
          "Create_Date",
          "Create_By"
        )
        .orderBy("Notify_Level", "desc")
        .orderBy("Create_Date");
      if (result) {
        return result;
      } else {
        return { status: 404, message: "Record not found" };
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  async DeleteSelectAlert(_Data: dataDashboard) {
    try {
      const result = _Data.DeleteSelectData.map((item) => {
        return db_QMS("QualtyDashboardNotify").where("ID", item.ID).del();
      });
      await Promise.all(result);
      if (result) {
        return { status: 200, message: "Data Deleted" };
      } else {
        return { status: 404, message: "Record not found" };
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }

  async GetSMLD_Dashboard(Mc_Type: string) {
    try {
      const queryString = `exec smld_today '${Mc_Type}'`;
      const result = await db_QMS_SMLD.raw(queryString);
      return await result;
    } catch (error) {
      console.error("Error retrieving data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  async GetNoStartUpCheck_Dashboard() {
    try {
      const date_Bangkok = getCurrentDateTimeInBangkok();
      const currentDate = date_Bangkok.split(" ")[0]; // เอาเฉพาะวันที่
      const currentHour = Number(date_Bangkok.split(" ")[1].split(":")[0]); // เอาเฉพาะชั่วโมงแล้วแปลงเป็นตัวเลข
      const SHIFT = currentHour >= 8 && currentHour < 19 ? "DAY" : "NIGHT";
      const queryString = `
     SELECT  m1.Line_Name , SHIFT ,SHIFT_DATE,Biz_Group
      FROM (
              SELECT v2.Line_Name, NULL AS SHIFT, NULL AS PERIOD, NULL AS SHIFT_DATE, NULL AS CONFIRM2
              FROM STU.MST_LINE v2
                        LEFT JOIN STU.StartUpCheck_Time v1 ON
                  v2.Line_Name = (CASE WHEN v1.LINE = 'P02' THEN 'P01' ELSE v1.LINE END)
                      AND v1.SHIFT = '${SHIFT}'
                      AND v1.PERIOD = 'SHIFT'
                      AND v1.SHIFT_DATE = '${currentDate}'
              WHERE v1.LINE IS NULL
              UNION ALL
              SELECT v1.LINE, v1.SHIFT, v1.PERIOD, v1.SHIFT_DATE, v1.CONFIRM2
              FROM STU.StartUpCheck_Time v1
              WHERE v1.SHIFT = '${SHIFT}'
                AND v1.PERIOD = 'SHIFT'
                AND v1.SHIFT_DATE = '${currentDate}'
                AND v1.CONFIRM2 IS NULL
                AND STATUS = 'Run'
          ) m1
              inner join
          STU.MST_LINE m2
          on m1.Line_Name = m2.Line_Name
      `;
      const result = await db_STU.raw(queryString);
      return await result;
    } catch (error) {
      console.error("Error retrieving data:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
}
