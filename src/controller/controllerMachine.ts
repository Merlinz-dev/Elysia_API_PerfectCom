import { t } from 'elysia';
import { dataMachine } from '../DataType'
import { db_CFSMART } from '../config/config';
import { startOfWeek, endOfWeek, parseISO, format, addWeeks, startOfMonth, endOfMonth } from 'date-fns';

export class classMachine {

    async GetLayoutPosition_EHUM() {
        try {
            const result = await db_CFSMART('MST_LINE_LAYOUT')
                .select('*')
            if (result) {
                return result;
            } else {
                return { status: 404, message: 'Record not found' };
            }
        } catch (error) {
            console.error('Error updating data:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
    async GetLineStop_EHUM(WebName: string) {
        try {
            // console.log(WebName);

            const troubleNames = [
                'Pick up error', 'Mark error', 'Load error', 'Machine Hang', 'Option Error',
                'Nozzle Error', 'Feeder error', 'Conveyer Error', 'Request CM Support',
                'Reflow Alarm', 'Spoilage Warning', 'Machine Error ( Cutting )'
            ];

            const query = db_CFSMART('R_LINE_MAINTENANCE')
                .select('LINE_NAME', 'MC_NAME', 'MC_NO', 'TROUBLE_NAME', 'STATUS_NAME', 'REQUEST_TIME', 'OPERATOR_ID')
                .where('REQUEST_TIME', '>=', db_CFSMART.raw("CONVERT(VARCHAR, GETDATE(), 111) + ' 00:00:00'"))
                .andWhere('STATUS_NAME', 'in', ['WAIT', 'WORKING'])
                .andWhere('END_TIME', null)
                .andWhere('REQUEST_TIME', '>', db_CFSMART.raw("DATEADD(minute, -30, GETDATE())"));

            if (WebName === 'Machine') {
                query.andWhere('TROUBLE_NAME', 'in', troubleNames);
            }

            const result = await query;
            return result;
        } catch (error) {
            console.error(error);
            throw new Error('Internal Server Error');
        }
    }
    async GetLineStop_Argent_EHUM(WebName: string) {
        try {
            const baseQueryString = "SELECT LINE_NAME, MC_NAME, MC_NO, TROUBLE_NAME, STATUS_NAME, REQUEST_TIME, OPERATOR_ID " +
                "FROM R_LINE_MAINTENANCE " +
                "WHERE REQUEST_TIME >= CONVERT(VARCHAR, GETDATE(), 111) + ' 00:00:00' " +
                "AND STATUS_NAME in('WAIT' ,'WORKING') " +
                "AND END_TIME IS NULL " +
                "AND REQUEST_TIME <= DATEADD(minute, -30, GETDATE())";

            const troubleNames = [
                'Pick up error', 'Mark error', 'Load error', 'Machine Hang', 'Option Error',
                'Nozzle Error', 'Feeder error', 'Conveyer Error', 'Request CM Support',
                'Reflow Alarm', 'Spoilage Warning', 'Machine Error ( Cutting )'
            ];

            let queryString = baseQueryString;

            if (WebName === 'Machine') {
                const troubleNamesList = troubleNames.map(name => `'${name}'`).join(', ');
                queryString += ` AND TROUBLE_NAME IN (${troubleNamesList})`;
            }

            const result = await db_CFSMART.raw(queryString);
            return result;
        } catch (error) {
            console.error(error);
            throw new Error('Internal Server Error');
        }
    }
    async GetTopArgent_EHUM(WebName: string) {
        try {
            const baseQueryString = "SELECT LINE_NAME, MC_NAME, MC_NO, TROUBLE_NAME, OPERATOR_ID, " +
                "STATUS_NAME, REQUEST_TIME, DATEDIFF(minute, REQUEST_TIME, GETDATE()) AS TIME_DIFFERENCE " +
                "FROM R_LINE_MAINTENANCE " +
                "WHERE REQUEST_TIME >= CONVERT(VARCHAR, GETDATE(), 111) + ' 00:00:00' " +
                "AND STATUS_NAME in('WAIT' ,'WORKING')  " +
                "AND END_TIME IS NULL " +
                "AND REQUEST_TIME <= DATEADD(minute, -30, GETDATE()) " +
                "ORDER BY REQUEST_TIME";

            const troubleNames = [
                'Pick up error', 'Mark error', 'Load error', 'Machine Hang', 'Option Error',
                'Nozzle Error', 'Feeder error', 'Conveyer Error', 'Request CM Support',
                'Reflow Alarm', 'Spoilage Warning', 'Machine Error ( Cutting )'
            ];

            let queryString = baseQueryString;

            if (WebName === 'Machine') {
                const troubleNamesList = troubleNames.map(name => `'${name}'`).join(', ');
                queryString = baseQueryString.replace(
                    "ORDER BY REQUEST_TIME",
                    `AND TROUBLE_NAME IN (${troubleNamesList}) ORDER BY REQUEST_TIME`
                );
            }

            const result = await db_CFSMART.raw(queryString);
            return result;
        } catch (error) {
            console.error(error);
            throw new Error('Internal Server Error');
        }
    }

    // async GetLineStop_EHUM() {
    //     try {
    //         const result = await db_CFSMART('R_LINE_MAINTENANCE')
    //             .select('LINE_NAME', 'MC_NAME', 'MC_NO', 'TROUBLE_NAME', 'STATUS_NAME', 'REQUEST_TIME', 'OPERATOR_ID')
    //             .where('REQUEST_TIME', '>=', db_CFSMART.raw("CONVERT(VARCHAR, GETDATE(), 111) + ' 00:00:00'"))
    //             .andWhere('STATUS_NAME', 'in', ['WAIT', 'WORKING'])
    //             .andWhere('END_TIME', null)
    //             .andWhere('REQUEST_TIME', '>', db_CFSMART.raw("DATEADD(minute, -30, GETDATE())"));
    //         return result;
    //     } catch (error) {
    //         console.error(error);
    //         throw new Error('Internal Server Error');
    //     }
    // }
    // async GetLineStop_Argent_EHUM() {
    //     const queryString = "SELECT LINE_NAME, MC_NAME, MC_NO, TROUBLE_NAME, STATUS_NAME, REQUEST_TIME,OPERATOR_ID " +
    //         "FROM R_LINE_MAINTENANCE " +
    //         "WHERE REQUEST_TIME >= CONVERT(VARCHAR, GETDATE(), 111) + ' 00:00:00' " +
    //         "AND STATUS_NAME in('WAIT' ,'WORKING') " +
    //         "AND END_TIME IS NULL " +
    //         "AND REQUEST_TIME <= DATEADD(minute, -30, GETDATE())";
    //     const result = await db_CFSMART.raw(queryString);
    //     return await result
    // }
    // async GetTopArgent_EHUM() {
    //     const queryString = "SELECT  LINE_NAME, MC_NAME, MC_NO, TROUBLE_NAME,OPERATOR_ID, " +
    //         "STATUS_NAME, REQUEST_TIME ,DATEDIFF(minute, REQUEST_TIME, GETDATE()) AS TIME_DIFFERENCE " +
    //         "FROM R_LINE_MAINTENANCE " +
    //         "WHERE REQUEST_TIME >= CONVERT(VARCHAR, GETDATE(), 111) + ' 00:00:00' " +
    //         "AND STATUS_NAME in('WAIT' ,'WORKING')  " +
    //         "AND END_TIME IS NULL " +
    //         "AND REQUEST_TIME <= DATEADD(minute, -30, GETDATE())" +
    //         "ORDER BY  REQUEST_TIME";
    //     const result = await db_CFSMART.raw(queryString);
    //     return await result
    // }
    async GetNoPlan_EHUM() {
        try {
            const result = await db_CFSMART('V_PHP_PROGRESS_ALL as dt')
                .rightJoin('MST_LINE as ln', 'dt.Line_Name', 'ln.Line_Name')
                .select('ln.Line_Name as Line_MST', db_CFSMART.raw("'No Plan' as TROUBLE_NAME"))
                .whereNull('dt.PLAN_ID')
                .orderBy('Line_MST');

            return result;
        } catch (error) {
            console.error(error);
            throw new Error('Internal Server Error');
        }
    }

    async GetPickUpRate(_Data: dataMachine) {
        const queryString = `EXEC PHP_SMART_PROGRESS '${_Data.StartDate}','${_Data.EndDate}',null,'${_Data.Line_Name}',null,null,null,null,12`;
        const result = await db_CFSMART.raw(queryString);
        return await result
    }
    async GetEHUMbyLINE(_Data: dataMachine) {
        const queryString = `SELECT  LINE_NAME, MC_NAME, MC_NO, TROUBLE_NAME, OPERATOR_ID,
        STATUS_NAME, REQUEST_TIME, DATEDIFF(minute, REQUEST_TIME, GETDATE()) AS TIME_DIFFERENCE
        FROM R_LINE_MAINTENANCE
        WHERE REQUEST_TIME >= CONVERT(VARCHAR, GETDATE(), 111) + ' 00:00:00'
        AND STATUS_NAME in('WAIT' ,'WORKING')
        AND END_TIME IS NULL
        AND LINE_NAME = '${_Data.Line_Name}'
        ORDER BY  REQUEST_TIME`;
        const result = await db_CFSMART.raw(queryString);
        return await result
    }
    // async GetLineStopTimeByLine(_Data: dataMachine) {
    //     let queryString = '';
    //     if (_Data.Line_Name === "ALL") {
    //         switch (_Data.ChartType) {
    //             case "Ratio":
    //                 queryString = `SELECT LINE_NAME, RTRIM(TROUBLE_NAME) AS TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME, CAST(0.07 AS FLOAT) AS Target_Time, DateCD, WAITING_TIME, WORKING_TIME, DONE_TIME,
    //         CONCAT(DATEPART(WEEK, convert(datetime, DateCD)), '-',DATEPART(YEAR, convert(datetime, DateCD)) ) AS WeekOfYear,CONCAT(DATEPART(MONTH, convert(datetime, DateCD)), '-',DATEPART(YEAR, convert(datetime, DateCD)) ) AS MonthCD
    //         ,DATEPART(YEAR, convert(datetime, DateCD))AS  YearCD
    //             ,CAST(0.07 AS FLOAT) AS Target_Time_Week,CAST(0.07 AS FLOAT) AS Target_Time_Month
    //             ,ROUND((DONE_TIME/6),5) AS DONE_TIME_WEEK,ROUND((DONE_TIME/24),5) AS DONE_TIME_MONTH
    //             FROM (
    //                 SELECT LINE_NAME, TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME,
    //                 CASE
    //                     WHEN  convert(time, REQUEST_TIME) >= '00:00:00' and convert(time, REQUEST_TIME) <= '07:59:00' THEN convert(varchar, convert(datetime, REQUEST_TIME) - 1, 112)
    //                     ELSE convert(varchar, convert(datetime, REQUEST_TIME), 112)
    //                 END AS DateCD,
    //                 CASE
    //                     WHEN START_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), GETDATE())
    //                     ELSE DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), convert(datetime, START_TIME))
    //                 END AS WAITING_TIME ,
    //                 CASE
    //                     WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, START_TIME), GETDATE())
    //                     ELSE DATEDIFF(MINUTE, convert(datetime, START_TIME), convert(datetime, END_TIME))
    //                 END AS WORKING_TIME,
    //                 ROUND(
    //             CASE
    //                 WHEN END_TIME IS NULL 
    //                     THEN CAST(DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), GETDATE()) AS FLOAT) / (24 * 60*53)
    //                 ELSE CAST(DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), CONVERT(DATETIME, END_TIME)) AS FLOAT) / (24 * 60*53)
    //             END, 3
    //         ) AS DONE_TIME
    //             FROM
    //                 V_LINE_MAINTENANCE
    //             ${_Data.WebName === 'Machine' ? `  WHERE   TROUBLE_NAME IN ('Pick up error','Mark error','Load error','Machine Hang','Option Error','Nozzle Error','Feeder error','Conveyer Error'
    //             ,'Request CM Support','Reflow Alarm','Spoilage Warning','Machine Error ( Cutting )') `: ''}
    //                     ) AS V1
    //             WHERE DateCD BETWEEN '${_Data.StartDate}' AND '${_Data.EndDate}'
    //             ORDER BY DateCD`;
    //                 break;
    //             default:
    //                 queryString = `SELECT LINE_NAME, RTRIM(TROUBLE_NAME) AS TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME, CAST(60*53 AS INT) AS Target_Time, DateCD, WAITING_TIME, WORKING_TIME, DONE_TIME,
    //                 CONCAT(DATEPART(WEEK, convert(datetime, DateCD)), '-',DATEPART(YEAR, convert(datetime, DateCD)) ) AS WeekOfYear,CONCAT(DATEPART(MONTH, convert(datetime, DateCD)), '-',DATEPART(YEAR, convert(datetime, DateCD)) ) AS MonthCD
    //                 ,DATEPART(YEAR, convert(datetime, DateCD))AS  YearCD
    //                     ,CAST(60*6*53 AS INT) AS Target_Time_Week,CAST(60*6*4*53  AS INT) AS Target_Time_Month
    //                     ,DONE_TIME AS DONE_TIME_WEEK,DONE_TIME AS DONE_TIME_MONTH
    //                     FROM (
    //                         SELECT LINE_NAME, TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME,
    //                         CASE
    //                             WHEN  convert(time, REQUEST_TIME) >= '00:00:00' and convert(time, REQUEST_TIME) <= '07:59:00' THEN convert(varchar, convert(datetime, REQUEST_TIME) - 1, 112)
    //                             ELSE convert(varchar, convert(datetime, REQUEST_TIME), 112)
    //                         END AS DateCD,
    //                         CASE
    //                             WHEN START_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), GETDATE())
    //                             ELSE DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), convert(datetime, START_TIME))
    //                         END AS WAITING_TIME ,
    //                         CASE
    //                             WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, START_TIME), GETDATE())
    //                             ELSE DATEDIFF(MINUTE, convert(datetime, START_TIME), convert(datetime, END_TIME))
    //                         END AS WORKING_TIME,
    //                         ROUND(
    //                     CASE
    //                         WHEN END_TIME IS NULL 
    //                             THEN CAST(DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), GETDATE()) AS INT)
    //                         ELSE CAST(DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), CONVERT(DATETIME, END_TIME)) AS INT) 
    //                     END, 3
    //                 ) AS DONE_TIME
    //                     FROM
    //                         V_LINE_MAINTENANCE
    //                         ${_Data.WebName === 'Machine' ? `  WHERE   TROUBLE_NAME IN ('Pick up error','Mark error','Load error','Machine Hang','Option Error','Nozzle Error','Feeder error','Conveyer Error'
    //                         ,'Request CM Support','Reflow Alarm','Spoilage Warning','Machine Error ( Cutting )') ` : ''}
    //                             ) AS V1
    //                     WHERE DateCD BETWEEN '${_Data.StartDate}' AND '${_Data.EndDate}'
    //                     ORDER BY DateCD`;
    //                 break;
    //         }
    //     }
    //     else {
    //         switch (_Data.ChartType) {
    //             case "Ratio":
    //                 queryString = `SELECT LINE_NAME, RTRIM(TROUBLE_NAME) AS TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME, CAST(0.07 AS FLOAT) AS Target_Time, DateCD, WAITING_TIME, WORKING_TIME, DONE_TIME,
    //                 CONCAT(DATEPART(WEEK, convert(datetime, DateCD)), '-',DATEPART(YEAR, convert(datetime, DateCD)) ) AS WeekOfYear,CONCAT(DATEPART(MONTH, convert(datetime, DateCD)), '-',DATEPART(YEAR, convert(datetime, DateCD)) ) AS MonthCD
    //                 ,DATEPART(YEAR, convert(datetime, DateCD))AS  YearCD
    //                     ,CAST(0.07 AS FLOAT) AS Target_Time_Week,CAST(0.07 AS FLOAT) AS Target_Time_Month
    //                     ,ROUND((DONE_TIME/6),5) AS DONE_TIME_WEEK,ROUND((DONE_TIME/24),5) AS DONE_TIME_MONTH          
    //                     FROM (
    //                         SELECT LINE_NAME, TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME,
    //                         CASE
    //                             WHEN  convert(time, REQUEST_TIME) >= '00:00:00' and convert(time, REQUEST_TIME) <= '07:59:00' THEN convert(varchar, convert(datetime, REQUEST_TIME) - 1, 112)
    //                             ELSE convert(varchar, convert(datetime, REQUEST_TIME), 112)
    //                         END AS DateCD,
    //                         CASE
    //                             WHEN START_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), GETDATE())
    //                             ELSE DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), convert(datetime, START_TIME))
    //                         END AS WAITING_TIME ,
    //                         CASE
    //                             WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, START_TIME), GETDATE())
    //                             ELSE DATEDIFF(MINUTE, convert(datetime, START_TIME), convert(datetime, END_TIME))
    //                         END AS WORKING_TIME,
    //                         ROUND(
    //                     CASE
    //                         WHEN END_TIME IS NULL 
    //                             THEN CAST(DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), GETDATE()) AS FLOAT) / (24 * 60)
    //                         ELSE CAST(DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), CONVERT(DATETIME, END_TIME)) AS FLOAT) / (24 * 60)
    //                     END, 3
    //                 ) AS DONE_TIME
    //                     FROM
    //                         V_LINE_MAINTENANCE
    //                     WHERE  LINE_NAME = '${_Data.Line_Name}'
    //                     ${_Data.WebName === 'Machine' ? `AND TROUBLE_NAME IN ('Pick up error','Mark error','Load error','Machine Hang','Option Error','Nozzle Error','Feeder error','Conveyer Error'
    //                     ,'Request CM Support','Reflow Alarm','Spoilage Warning','Machine Error ( Cutting )') `  :''}
    //                             ) AS V1
    //                     WHERE DateCD BETWEEN '${_Data.StartDate}' AND '${_Data.EndDate}'
    //                     ORDER BY DateCD`;
    //                 break;
    //             default:
    //                 queryString = `SELECT LINE_NAME, RTRIM(TROUBLE_NAME) AS TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME, CAST(60 AS INT) AS Target_Time, DateCD, WAITING_TIME, WORKING_TIME, DONE_TIME,
    //                 CONCAT(DATEPART(WEEK, convert(datetime, DateCD)), '-',DATEPART(YEAR, convert(datetime, DateCD)) ) AS WeekOfYear,CONCAT(DATEPART(MONTH, convert(datetime, DateCD)), '-',DATEPART(YEAR, convert(datetime, DateCD)) ) AS MonthCD
    //                 ,DATEPART(YEAR, convert(datetime, DateCD))AS  YearCD
    //                     ,CAST(60*6 AS INT) AS Target_Time_Week,CAST(60*6*4 AS INT) AS Target_Time_Month
    //                     ,DONE_TIME AS DONE_TIME_WEEK,DONE_TIME AS DONE_TIME_MONTH     
    //                     FROM (
    //                         SELECT LINE_NAME, TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME,
    //                         CASE
    //                             WHEN  convert(time, REQUEST_TIME) >= '00:00:00' and convert(time, REQUEST_TIME) <= '07:59:00' THEN convert(varchar, convert(datetime, REQUEST_TIME) - 1, 112)
    //                             ELSE convert(varchar, convert(datetime, REQUEST_TIME), 112)
    //                         END AS DateCD,
    //                         CASE
    //                             WHEN START_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), GETDATE())
    //                             ELSE DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), convert(datetime, START_TIME))
    //                         END AS WAITING_TIME ,
    //                         CASE
    //                             WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, START_TIME), GETDATE())
    //                             ELSE DATEDIFF(MINUTE, convert(datetime, START_TIME), convert(datetime, END_TIME))
    //                         END AS WORKING_TIME,
    //                         ROUND(
    //                     CASE
    //                         WHEN END_TIME IS NULL 
    //                             THEN CAST(DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), GETDATE()) AS INT) 
    //                         ELSE CAST(DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), CONVERT(DATETIME, END_TIME)) AS INT) 
    //                     END, 3
    //                 ) AS DONE_TIME
    //                     FROM
    //                         V_LINE_MAINTENANCE
    //                     WHERE  LINE_NAME = '${_Data.Line_Name}'
    //                         ${_Data.WebName === 'Machine' ? `AND TROUBLE_NAME IN ('Pick up error','Mark error','Load error','Machine Hang','Option Error','Nozzle Error','Feeder error','Conveyer Error'
    //                                     ,'Request CM Support','Reflow Alarm','Spoilage Warning','Machine Error ( Cutting )') ` : ''}
    //                             ) AS V1
    //                     WHERE DateCD BETWEEN '${_Data.StartDate}' AND '${_Data.EndDate}'
    //                     ORDER BY DateCD`;
    //                 break;
    //         }
    //     }
    // console.log(queryString);
    //     const result = await db_CFSMART.raw(queryString);
    //     return await result
    // }
    async GetLineStopTimeByLine(_Data: dataMachine) {
        try {
            // console.log(_Data);
            const troubleNames = [
                'Pick up error', 'Mark error', 'Load error', 'Machine Hang', 'Option Error',
                'Nozzle Error', 'Feeder error', 'Conveyer Error', 'Request CM Support',
                'Reflow Alarm', 'Spoilage Warning', 'Machine Error ( Cutting )'
            ];
            const targetTime = _Data.ChartType === "Ratio" ? _Data.WebName === 'Machine' ? "CAST(7.00 AS FLOAT)" : "CAST(15.00 AS FLOAT)" : "CAST(60 AS INT)";
            const targetTimeWeek = _Data.ChartType === "Ratio" ? _Data.WebName === 'Machine' ? "CAST(7.00 AS FLOAT)" : "CAST(15.00 AS FLOAT)" : "CAST(60*6 AS INT)";
            const targetTimeMonth = _Data.ChartType === "Ratio" ? _Data.WebName === 'Machine' ? "CAST(7.00 AS FLOAT)" : "CAST(15.00 AS FLOAT)" : "CAST(60*6*4 AS INT)";
            const doneTime = _Data.ChartType === "Ratio" ? "ROUND((DONE_TIME),5) * 100" : "DONE_TIME";
            const doneTimeWeek = _Data.ChartType === "Ratio" ? "ROUND((DONE_TIME/6),5) * 100" : "DONE_TIME";
            const doneTimeMonth = _Data.ChartType === "Ratio" ? "ROUND((DONE_TIME/24),5) * 100" : "DONE_TIME";
    
            let queryString = `
                SELECT 
                    LINE_NAME, 
                    RTRIM(TROUBLE_NAME) AS TROUBLE_NAME, 
                    REQUEST_TIME, 
                    START_TIME, 
                    END_TIME,
                    ${targetTime} AS Target_Time, 
                    DateCD, 
                    WAITING_TIME, 
                    WORKING_TIME, 
                    ${doneTime} AS DONE_TIME,
                    CONCAT(DATEPART(WEEK, CONVERT(datetime, DateCD)), '-', DATEPART(YEAR, CONVERT(datetime, DateCD))) AS WeekOfYear,
                    CONCAT(DATEPART(MONTH, CONVERT(datetime, DateCD)), '-', DATEPART(YEAR, CONVERT(datetime, DateCD))) AS MonthCD,
                    DATEPART(YEAR, CONVERT(datetime, DateCD)) AS YearCD,
                    ${targetTimeWeek} AS Target_Time_Week,
                    ${targetTimeMonth} AS Target_Time_Month,
                    ${doneTimeWeek} AS DONE_TIME_WEEK,
                    ${doneTimeMonth} AS DONE_TIME_MONTH
                FROM (
                    SELECT 
                        LINE_NAME, 
                        TROUBLE_NAME, 
                        REQUEST_TIME, 
                        START_TIME, 
                        END_TIME,
                        CASE
                            WHEN CONVERT(time, REQUEST_TIME) >= '00:00:00' AND CONVERT(time, REQUEST_TIME) <= '07:59:00' 
                                THEN CONVERT(varchar, CONVERT(datetime, REQUEST_TIME) - 1, 112)
                            ELSE CONVERT(varchar, CONVERT(datetime, REQUEST_TIME), 112)
                        END AS DateCD,
                        CASE
                            WHEN START_TIME IS NULL 
                                THEN DATEDIFF(MINUTE, CONVERT(datetime, REQUEST_TIME), GETDATE())
                            ELSE DATEDIFF(MINUTE, CONVERT(datetime, REQUEST_TIME), CONVERT(datetime, START_TIME))
                        END AS WAITING_TIME,
                        CASE
                            WHEN END_TIME IS NULL 
                                THEN DATEDIFF(MINUTE, CONVERT(datetime, START_TIME), GETDATE())
                            ELSE DATEDIFF(MINUTE, CONVERT(datetime, START_TIME), CONVERT(datetime, END_TIME))
                        END AS WORKING_TIME,
                        ${_Data.ChartType === "Ratio" ?
                    `ROUND(
                            CASE
                                WHEN END_TIME IS NULL 
                                    THEN CAST(DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), GETDATE()) AS FLOAT) / 
                                         (24 * 60${_Data.Line_Name === "ALL" ? "*53" : ""}) 
                                ELSE CAST(DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), CONVERT(DATETIME, END_TIME)) AS FLOAT) / 
                                     (24 * 60${_Data.Line_Name === "ALL" ? "*53" : ""}) 
                            END, 6
                        ) AS DONE_TIME` :
                    `CASE
                            WHEN END_TIME IS NULL 
                                THEN CAST(DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), GETDATE()) AS INT)
                            ELSE CAST(DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), CONVERT(DATETIME, END_TIME)) AS INT)
                        END AS DONE_TIME`}
                    FROM V_LINE_MAINTENANCE
                    WHERE 1=1
                        ${_Data.Line_Name !== "ALL" ? `AND LINE_NAME = '${_Data.Line_Name}'` : ''}
                        ${_Data.WebName === 'Machine' ? `AND TROUBLE_NAME IN ('${troubleNames.join("','")}')` : ''}
                ) AS V1
                WHERE DateCD BETWEEN '${_Data.StartDate}' AND '${_Data.EndDate}'
                ORDER BY DateCD;
            `;
            // console.log(queryString);
            const result = await db_CFSMART.raw(queryString);
            return result;
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        }
    }



    async GetEHUMbyLineAndTroubleName(_Data: dataMachine) {
        let queryString = '';
        if (_Data.Line_Name === "ALL") {
            queryString = `SELECT LINE_NAME, TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME, CAST(60 AS INT) AS Target_Time, DateCD, WAITING_TIME, WORKING_TIME, DONE_TIME,
            DATEPART(WEEK, convert(datetime, DateCD)) AS WeekOfYear,DATEPART(MONTH, convert(datetime, DateCD)) AS MonthCD
            ,CAST(360 AS INT) AS Target_Time_Week,CAST(1440 AS INT) AS Target_Time_Month
            FROM (
                SELECT LINE_NAME, TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME,
                CASE
                    WHEN  convert(time, REQUEST_TIME) >= '00:00:00' and convert(time, REQUEST_TIME) <= '07:59:00' THEN convert(varchar, convert(datetime, REQUEST_TIME) - 1, 112)
                    ELSE convert(varchar, convert(datetime, REQUEST_TIME), 112)
                END AS DateCD,
                CASE
                    WHEN START_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), GETDATE())
                    ELSE DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), convert(datetime, START_TIME))
                END AS WAITING_TIME ,
                CASE
                    WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, START_TIME), GETDATE())
                    ELSE DATEDIFF(MINUTE, convert(datetime, START_TIME), convert(datetime, END_TIME))
                END AS WORKING_TIME,
                CASE
                    WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), GETDATE())
                    ELSE DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), convert(datetime, END_TIME))
                END AS DONE_TIME
            FROM
                V_LINE_MAINTENANCE
            WHERE   TROUBLE_NAME  = '${_Data.TROUBLE_NAME}'
                    ) AS V1
            WHERE DateCD BETWEEN '${_Data.StartDate}' AND '${_Data.EndDate}'
            ORDER BY DateCD`;
        }
        else {
            queryString = `SELECT LINE_NAME, TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME, CAST(60 AS INT) AS Target_Time, DateCD, WAITING_TIME, WORKING_TIME, DONE_TIME,
            DATEPART(WEEK, convert(datetime, DateCD)) AS WeekOfYear,DATEPART(MONTH, convert(datetime, DateCD)) AS MonthCD
            ,CAST(360 AS INT) AS Target_Time_Week,CAST(1440 AS INT) AS Target_Time_Month
            FROM (
                SELECT LINE_NAME, TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME,
                CASE
                    WHEN  convert(time, REQUEST_TIME) >= '00:00:00' and convert(time, REQUEST_TIME) <= '07:59:00' THEN convert(varchar, convert(datetime, REQUEST_TIME) - 1, 112)
                    ELSE convert(varchar, convert(datetime, REQUEST_TIME), 112)
                END AS DateCD,
                CASE
                    WHEN START_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), GETDATE())
                    ELSE DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), convert(datetime, START_TIME))
                END AS WAITING_TIME ,
                CASE
                    WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, START_TIME), GETDATE())
                    ELSE DATEDIFF(MINUTE, convert(datetime, START_TIME), convert(datetime, END_TIME))
                END AS WORKING_TIME,
                CASE
                    WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), GETDATE())
                    ELSE DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), convert(datetime, END_TIME))
                END AS DONE_TIME
            FROM
                V_LINE_MAINTENANCE
            WHERE  LINE_NAME = '${_Data.Line_Name}'
                AND TROUBLE_NAME  = '${_Data.TROUBLE_NAME}'
                    ) AS V1
            WHERE DateCD BETWEEN '${_Data.StartDate}' AND '${_Data.EndDate}'
            ORDER BY DateCD`;
        }

        const result = await db_CFSMART.raw(queryString);
        return await result
    }
    async GetLineStopTime_Pareto_Day(_Data: dataMachine) {
        try {
            const baseQuery = `
                SELECT RTRIM(TROUBLE_NAME) AS TROUBLE_NAME, 
                    SUM(DONE_TIME) AS DONE_TIME, 
                    SUM(SUM(DONE_TIME)) OVER () AS ALL_DONE_TIME, 
                       ROUND(CAST(SUM(DONE_TIME) * 100.0 AS FLOAT) / SUM(SUM(DONE_TIME)) OVER (), 2) AS Pareto_Percentage
                FROM (
                    SELECT LINE_NAME, TROUBLE_NAME, REQUEST_TIME, START_TIME, END_TIME,
                        CASE
                            WHEN convert(time, REQUEST_TIME) >= '00:00:00' AND convert(time, REQUEST_TIME) <= '07:59:00' THEN convert(varchar, convert(datetime, REQUEST_TIME) - 1, 112)
                            ELSE convert(varchar, convert(datetime, REQUEST_TIME), 112)
                        END AS DateCD,
                        CASE
                            WHEN START_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), GETDATE())
                            ELSE DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), convert(datetime, START_TIME))
                        END AS WAITING_TIME,
                        CASE
                            WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, START_TIME), GETDATE())
                            ELSE DATEDIFF(MINUTE, convert(datetime, START_TIME), convert(datetime, END_TIME))
                        END AS WORKING_TIME,
                        CASE
                            WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), GETDATE())
                            ELSE DATEDIFF(MINUTE, convert(datetime, REQUEST_TIME), convert(datetime, END_TIME))
                        END AS DONE_TIME
                    FROM V_LINE_MAINTENANCE
                ) AS V1
                WHERE DateCD = '${_Data.StartDate}' 
            `;

            const conditions: string[] = [];

            if (_Data.Line_Name !== "ALL") {
                conditions.push(`LINE_NAME = '${_Data.Line_Name}'`);
            }

            if (_Data.WebName === 'Machine') {
                conditions.push(`TROUBLE_NAME IN ('Pick up error','Mark error','Load error','Machine Hang','Option Error','Nozzle Error','Feeder error','Conveyer Error','Request CM Support','Reflow Alarm','Spoilage Warning','Machine Error ( Cutting )')`);
            }

            const queryString = `
                ${baseQuery}
                ${conditions.length ? `AND ${conditions.join(' AND ')}` : ''}
                GROUP BY TROUBLE_NAME
                ORDER BY DONE_TIME DESC
            `;

            const result = await db_CFSMART.raw(queryString);

            // Add ParetoCal calculation
            let cumulativePercentage = 0;
            const dataWithParetoCal = result.map((row: any, index: number, array: any[]) => {
                if (index === array.length - 1) {
                    return { ...row, ParetoCal: parseFloat("100.00") }; // Last row ParetoCal set to 100.00
                } else {
                    cumulativePercentage += row.Pareto_Percentage;
                    return { ...row, ParetoCal: parseFloat(cumulativePercentage.toFixed(2)) }; // Round to 2 decimal places
                }
            });

            return dataWithParetoCal;
        } catch (error) {
            console.error(error);
            throw new Error('Internal Server Error');
        }
    }

    async GetLineStopTime_Pareto_Week(_Data: dataMachine) {
        try {
            // Assuming _Data.Week is provided in the format 'WK21'
            const weekString = _Data.Week;
            const weekNumber = parseInt(weekString.replace('WK', ''), 10);
            const year = _Data.Year;

            // Calculate the start and end date of the week
            const firstDayOfYear = new Date(year, 0, 1);
            const startOfYearWeek = startOfWeek(firstDayOfYear);
            const startOfWeekDate = addWeeks(startOfYearWeek, weekNumber - 1);
            const endOfWeekDate = endOfWeek(startOfWeekDate);

            const StartDate = format(startOfWeekDate, 'yyyyMMdd');
            const EndDate = format(endOfWeekDate, 'yyyyMMdd');

            const baseQuery = `
                SELECT RTRIM(TROUBLE_NAME) AS TROUBLE_NAME, 
                    SUM(DONE_TIME) AS DONE_TIME, 
                    SUM(SUM(DONE_TIME)) OVER () AS ALL_DONE_TIME, 
                    ROUND(CAST(SUM(DONE_TIME) * 100.0 AS FLOAT) / SUM(SUM(DONE_TIME)) OVER (), 2) AS Pareto_Percentage
                FROM (
                    SELECT LINE_NAME, 
                        TROUBLE_NAME, 
                        REQUEST_TIME, 
                        START_TIME, 
                        END_TIME,
                        CASE
                            WHEN CONVERT(TIME, REQUEST_TIME) >= '00:00:00' AND CONVERT(TIME, REQUEST_TIME) <= '07:59:00' THEN CONVERT(VARCHAR, CONVERT(DATETIME, REQUEST_TIME) - 1, 112)
                            ELSE CONVERT(VARCHAR, CONVERT(DATETIME, REQUEST_TIME), 112)
                        END AS DateCD,
                        CASE
                            WHEN START_TIME IS NULL THEN DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), GETDATE())
                            ELSE DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), CONVERT(DATETIME, START_TIME))
                        END AS WAITING_TIME,
                        CASE
                            WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, CONVERT(DATETIME, START_TIME), GETDATE())
                            ELSE DATEDIFF(MINUTE, CONVERT(DATETIME, START_TIME), CONVERT(DATETIME, END_TIME))
                        END AS WORKING_TIME,
                        CASE
                            WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), GETDATE())
                            ELSE DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), CONVERT(DATETIME, END_TIME))
                        END AS DONE_TIME
                    FROM V_LINE_MAINTENANCE
                ) AS V1
                WHERE DateCD BETWEEN '${StartDate}' AND '${EndDate}'
            `;

            const conditions: string[] = [];

            if (_Data.Line_Name !== "ALL") {
                conditions.push(`LINE_NAME = '${_Data.Line_Name}'`);
            }

            if (_Data.WebName === 'Machine') {
                conditions.push(`TROUBLE_NAME IN ('Pick up error','Mark error','Load error','Machine Hang','Option Error','Nozzle Error','Feeder error','Conveyer Error','Request CM Support','Reflow Alarm','Spoilage Warning','Machine Error ( Cutting )')`);
            }

            const queryString = `
                ${baseQuery}
                ${conditions.length ? `AND ${conditions.join(' AND ')}` : ''}
                GROUP BY TROUBLE_NAME
                ORDER BY DONE_TIME DESC
            `;

            const result = await db_CFSMART.raw(queryString);

            // Add ParetoCal calculation
            let cumulativePercentage = 0;
            const dataWithParetoCal = result.map((row: any, index: number, array: any[]) => {
                if (index === array.length - 1) {
                    return { ...row, ParetoCal: parseFloat("100.00") }; // Last row ParetoCal set to 100.00
                } else {
                    cumulativePercentage += row.Pareto_Percentage;
                    return { ...row, ParetoCal: parseFloat(cumulativePercentage.toFixed(2)) }; // Round to 2 decimal places
                }
            });

            return dataWithParetoCal;
        } catch (error) {
            console.error(error);
            throw new Error('Internal Server Error');
        }
    }

    async GetLineStopTime_Pareto_Month(_Data: dataMachine) {
        try {
            const monthNumber = _Data.Month;
            const year = _Data.Year;

            // Calculate the start and end date of the month
            const startOfMonthDate = startOfMonth(new Date(year, monthNumber - 1));
            const endOfMonthDate = endOfMonth(startOfMonthDate);

            const StartDate = format(startOfMonthDate, 'yyyyMMdd');
            const EndDate = format(endOfMonthDate, 'yyyyMMdd');

            const baseQuery = `
                SELECT RTRIM(TROUBLE_NAME) AS TROUBLE_NAME, 
                    SUM(DONE_TIME) AS DONE_TIME, 
                    SUM(SUM(DONE_TIME)) OVER () AS ALL_DONE_TIME, 
                       ROUND(CAST(SUM(DONE_TIME) * 100.0 AS FLOAT) / SUM(SUM(DONE_TIME)) OVER (), 2) AS Pareto_Percentage
                FROM (
                    SELECT LINE_NAME, 
                        TROUBLE_NAME, 
                        REQUEST_TIME, 
                        START_TIME, 
                        END_TIME,
                        CASE
                            WHEN CONVERT(TIME, REQUEST_TIME) >= '00:00:00' AND CONVERT(TIME, REQUEST_TIME) <= '07:59:00' THEN CONVERT(VARCHAR, CONVERT(DATETIME, REQUEST_TIME) - 1, 112)
                            ELSE CONVERT(VARCHAR, CONVERT(DATETIME, REQUEST_TIME), 112)
                        END AS DateCD,
                        CASE
                            WHEN START_TIME IS NULL THEN DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), GETDATE())
                            ELSE DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), CONVERT(DATETIME, START_TIME))
                        END AS WAITING_TIME,
                        CASE
                            WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, CONVERT(DATETIME, START_TIME), GETDATE())
                            ELSE DATEDIFF(MINUTE, CONVERT(DATETIME, START_TIME), CONVERT(DATETIME, END_TIME))
                        END AS WORKING_TIME,
                        CASE
                            WHEN END_TIME IS NULL THEN DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), GETDATE())
                            ELSE DATEDIFF(MINUTE, CONVERT(DATETIME, REQUEST_TIME), CONVERT(DATETIME, END_TIME))
                        END AS DONE_TIME
                    FROM V_LINE_MAINTENANCE
                ) AS V1
                WHERE DateCD BETWEEN '${StartDate}' AND '${EndDate}'
            `;

            const conditions: string[] = [];

            if (_Data.Line_Name !== "ALL") {
                conditions.push(`LINE_NAME = '${_Data.Line_Name}'`);
            }

            if (_Data.WebName === 'Machine') {
                conditions.push(`TROUBLE_NAME IN ('Pick up error','Mark error','Load error','Machine Hang','Option Error','Nozzle Error','Feeder error','Conveyer Error','Request CM Support','Reflow Alarm','Spoilage Warning','Machine Error ( Cutting )')`);
            }

            const queryString = `
                ${baseQuery}
                ${conditions.length ? `AND ${conditions.join(' AND ')}` : ''}
                GROUP BY TROUBLE_NAME
                ORDER BY DONE_TIME DESC
            `;

            const result = await db_CFSMART.raw(queryString);

            // Add ParetoCal calculation
            let cumulativePercentage = 0;
            const dataWithParetoCal = result.map((row: any, index: number, array: any[]) => {
                if (index === array.length - 1) {
                    return { ...row, ParetoCal: parseFloat("100.00") }; // Last row ParetoCal set to 100.00
                } else {
                    cumulativePercentage += row.Pareto_Percentage;
                    return { ...row, ParetoCal: parseFloat(cumulativePercentage.toFixed(2)) }; // Round to 2 decimal places
                }
            });

            return dataWithParetoCal;
        } catch (error) {
            console.error(error);
            throw new Error('Internal Server Error');
        }
    }

}