function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .openById("PUT_YOUR_SHEET_ID_HERE")
      .getSheetByName("SHEET_NAME"); // e.g. "Registrations"

    if (!sheet) {
      throw new Error("Sheet not found");
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),                                   // Timestamp
      data.name || "",
      data.phone || "",
      data.email || "",
      data.college || "",
      data.student_year || "",
      Array.isArray(data.events)
        ? data.events.join(", ")
        : data.events || "",
      data.food || "",
      data.transaction_id || "",
      data.screenshot_path || ""
    ]);

    return ContentService
      .createTextOutput(
        JSON.stringify({ success: true })
      )
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          error: err.message
        })
      )
      .setMimeType(ContentService.MimeType.JSON);
  }
}
