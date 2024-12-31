


import { data, dataAuth, dataUpload } from "../DataType";
import { db_main } from "../config/config";
import fs from "fs";
import path from "path";

export class classTest1 {
  async MST_LINE(_Data: data) {
    let query;
    if (_Data.Biz == "ALL") {
      query = db_main("MST_LINE").distinct("Line_Name");
    } else {
      query = db_main("MST_LINE")
        .distinct("Line_Name")
        .where("Biz_Group", _Data.Biz);
    }
    const result = await query;
    return result;
  }

  async MST_BIZ(_Data: data) {
    let query;
    if (_Data.Line_Name == "ALL") {
      query = db_main("MST_LINE").distinct("Biz_Group");
    } else {
      query = db_main("MST_LINE")
        .distinct("Biz_Group")
        .where("Line_Name", _Data.Line_Name);
    }
    const result = await query;
    return result;
  }
}


export class classTest2 {
  async MST_LINE(_Data: data) {
    let query;
    if (_Data.Biz == "ALL") {
      query = db_main("MST_LINE").distinct("Line_Name");
    } else {
      query = db_main("MST_LINE")
        .distinct("Line_Name")
        .where("Biz_Group", _Data.Biz);
    }
    const result = await query;
    return result;
  }

  async MST_BIZ(_Data: data) {
    let query;
    if (_Data.Line_Name == "ALL") {
      query = db_main("MST_LINE").distinct("Biz_Group");
    } else {
      query = db_main("MST_LINE")
        .distinct("Biz_Group")
        .where("Line_Name", _Data.Line_Name);
    }
    const result = await query;
    return result;
  }
}




