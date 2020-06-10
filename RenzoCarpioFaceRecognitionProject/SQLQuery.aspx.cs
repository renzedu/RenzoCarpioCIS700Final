using System;
using System.Collections.Generic;
using System.Web.Services;
using System.Data.SqlClient;


public class clsRow
{
    public string inmateid { get; set; }

    public string firstname { get; set; }
    public string lastname { get; set; }
    public string offenses { get; set; }

    public string age { get; set; }

    public string linkpicture { get; set; }
    public DateTime dtStartDate { get; set; }
    public DateTime dtEndDate { get; set; }
    public double fPercentCompleted { get; set; }
}
public class clsTable
{
    public clsTable()
    {
        Rows = new List<clsRow>();
    }
    public List<clsRow> Rows { get; set; }
}

public partial class SQLQuery : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Write("Inmate WebService");
    }

    [WebMethod()]
    public static string GetData(string name)
    {
        string jsonResult = "";
        string faceids = "";
        faceids = "";
        clsTable oTable = new clsTable();
        using (SqlConnection oConn = new SqlConnection("server=rccis700mldbserver.database.windows.net;uid=renzo;pwd=basic123.;database=RCCIS700MLIllinoisInmates;"))
        {
            
            oConn.Open();
            SqlCommand oCmd = new SqlCommand("SELECT inmateid FROM dbo.faceidinmate WHERE faceid in (" + name + ")", oConn);
            SqlDataReader oReader = oCmd.ExecuteReader();
            while (oReader.Read() == true)
            {
                clsRow oRow = new clsRow();
                oRow.inmateid = oReader["inmateid"].ToString();
                faceids += "'" + oRow.inmateid + "',";
                oTable.Rows.Add(oRow);
            }
            string faceidsformatted = faceids.Remove(faceids.Length - 1, 1);
            jsonResult = GetFullDetailsInmate(faceidsformatted);
            oReader.Close();
        }
        return jsonResult;
    }

    public static string GetFullDetailsInmate(string inmateIds)
    {
        string jsoncontent = "";

        string strSqlCommand = @"
                                SELECT  pr.id AS[inmate.id],
                                        pr.firstname AS[inmate.name],
                                        pr.lastname AS[inmate.lname],
                                       'https://renzocarpiofacerecognitionprojectcis700ml.azurewebsites.net/IllinoisDOCDataset/' + pr.id + '.jpg' AS[inmate.linkpicture],
                                        (
                                            SELECT pt.id AS id, pt.offense AS offense
                                            FROM dbo.illinoisdocinmatessentencing pt
                                            WHERE pt.id = pr.id
                                            FOR JSON PATH
                                        ) AS[inmate.offenses]
                               FROM dbo.illinoisdocinmates pr
                               WHERE pr.id in ( " + inmateIds + ")FOR JSON PATH, ROOT('Inmates')";



        using (SqlConnection oConn = new SqlConnection("server=rccis700mldbserver.database.windows.net;uid=renzo;pwd=basic123.;database=RCCIS700MLIllinoisInmates;"))
        {

            oConn.Open();
            SqlCommand oCmd = new SqlCommand(strSqlCommand, oConn);
            SqlDataReader oReader = oCmd.ExecuteReader();
            while (oReader.Read() == true)
            {
                //oRow.inmateid = oReader["inmateid"].ToString();
                jsoncontent = oReader.GetValue(0).ToString();
            }
            oReader.Close();
        }
        return jsoncontent;
    }

    [WebMethod()]
    public static clsTable GetDataInmate(string name)
    {
        string faceids = "";
        faceids = "";
        clsTable inmateDatatableResults = new clsTable();
        using (SqlConnection oConn = new SqlConnection("server=rccis700mldbserver.database.windows.net;uid=renzo;pwd=basic123.;database=RCCIS700MLIllinoisInmates;"))
        {
            oConn.Open();
            SqlCommand oCmd = new SqlCommand("SELECT inmateid FROM dbo.faceidinmate WHERE faceid in (" + name + ")", oConn);
            SqlDataReader oReader = oCmd.ExecuteReader();
            while (oReader.Read() == true)
            {
                clsRow oRow = new clsRow();
                oRow.inmateid = oReader["inmateid"].ToString();
                faceids += "'" + oRow.inmateid + "',";
            }
            string faceidsformatted = faceids.Remove(faceids.Length - 1, 1);
            inmateDatatableResults = GetDataFullDetailsInmate(faceidsformatted);
            oReader.Close();
        }
        return inmateDatatableResults;
    }



    public static clsTable GetDataFullDetailsInmate(string strListInmateIDs)
    {
        clsTable oTable = new clsTable();

        string strSqlCommand = @"
                                    SELECT  pr.id AS[inmateid],
	                                    pr.firstname AS[inmatefirstname],
	                                    pr.lastname AS[inmatelastname],
	                                    pr.age AS[inmateage],
	                                    'https://renzocarpiofacerecognitionprojectcis700ml.azurewebsites.net/IllinoisDOCDataset/' + pr.id + '.jpg' AS[inmatelinkpicture],
	                                    (
	                                    SELECT  pt.offense AS offense
	                                    FROM dbo.illinoisdocinmatessentencing pt
	                                    WHERE pt.id = pr.id
                                        FOR JSON PATH
	                                    ) AS[inmateoffenses]
                                     FROM dbo.illinoisdocinmates pr
                                     WHERE pr.id in ( " + strListInmateIDs + ")";


        using (SqlConnection oConn = new SqlConnection("server=rccis700mldbserver.database.windows.net;uid=renzo;pwd=basic123.;database=RCCIS700MLIllinoisInmates;"))
        {
            oConn.Open();
            SqlCommand oCmd = new SqlCommand(strSqlCommand, oConn);
            SqlDataReader oReader = oCmd.ExecuteReader();
            while (oReader.Read() == true)
            {
                clsRow oRow = new clsRow();
                oRow.inmateid = oReader["inmateid"].ToString();
                oRow.firstname = oReader["inmatefirstname"].ToString();
                oRow.lastname = oReader["inmatelastname"].ToString();
                oRow.age = oReader["inmateage"].ToString();
                oRow.linkpicture = oReader["inmatelinkpicture"].ToString();
                oRow.offenses = oReader["inmateoffenses"].ToString();
                //oRow.dtStartDate = Convert.ToDateTime(oReader["dtStartDate"]);
                //oRow.dtEndDate = Convert.ToDateTime(oReader["dtEndDate"]);
                oTable.Rows.Add(oRow);
            }
            oReader.Close();
        }
        return oTable;
    }

}