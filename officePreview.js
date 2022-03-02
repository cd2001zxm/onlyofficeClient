const Controller = require('egg').Controller;
const config = require('config');
const configServer = config.get('server');
const fileUtility = require("./utils/fileUtility");
const fileChoiceUrl = configServer.has('fileChoiceUrl') ? configServer.get('fileChoiceUrl') : "";
const plugins = config.get('plugins');

class OfficePreviewController extends Controller {
    async index(){
        try {
            const { ctx,app } = this;

            const resourceUrl = "http://resource.teld.org/telddoc/142/"
            const siteUrl = configServer.get('siteUrl');

            var fileName = fileUtility.getFileName(ctx.query.fileName);
            var downloadFileName = ctx.query.downloadFileName
    
            var lang = "zh"
            var userid = "test";
            var name = "test";
            var actionData = "null";
            var userGroup = "test";
            var reviewGroups = "test";
            var commentGroups = "test";
    
            var key = "" 
            var url = resourceUrl + downloadFileName 
            var urlUser = ""
            var mode = ctx.query.mode || "view"; 
            var type = ctx.query.type || ""; 
    
            var canEdit = configServer.get('editedDocs').indexOf(fileUtility.getFileExtension(fileName)) != -1;  // check if this file can be edited
            canEdit = false
            var submitForm = canEdit && (mode == "edit" || mode == "fillForms");
    
            var countVersion = 1;

            var argss = {
                apiUrl: siteUrl + configServer.get('apiUrl'),
                file: {
                    name: fileName,
                    ext: fileUtility.getFileExtension(fileName, true),
                    uri: url,
                    uriUser: urlUser,
                    version: countVersion,
                    created: new Date().toDateString(),
                    favorite: "null"
                },
                editor: {
                    type: type,
                    documentType: fileUtility.getFileType(fileName),
                    key: key,
                    token: "",
                    callbackUrl: url,
                    createUrl: null,
                    templates: null,
                    isEdit: canEdit && (mode == "edit" || mode == "view" || mode == "filter" || mode == "blockcontent"),
                    review: canEdit && (mode == "edit" || mode == "review"),
                    comment: mode != "view" && mode != "fillForms" && mode != "embedded" && mode != "blockcontent",
                    fillForms: mode != "view" && mode != "comment" && mode != "embedded" && mode != "blockcontent",
                    modifyFilter: mode != "filter",
                    modifyContentControl: mode != "blockcontent",
                    copy: false,
                    download: false,
                    print: false,
                    mode: canEdit && mode != "view" ? "edit" : "view",
                    canBackToFolder: type != "embedded",
                    backUrl: "",
                    curUserHostAddress: "",
                    lang: lang,
                    userid: userid,
                    name: name,
                    userGroup: userGroup,
                    reviewGroups: JSON.stringify(reviewGroups),
                    commentGroups: JSON.stringify(commentGroups),
                    fileChoiceUrl: fileChoiceUrl,
                    submitForm: submitForm,
                    plugins: JSON.stringify(plugins),
                    actionData: actionData
                },
                history: null,
                historyData: null,
                dataInsertImage: {
                    fileType: "png",
                    url: ""
                },
                dataCompareFile: {
                    fileType: "docx",
                    url: ""
                },
                dataMailMergeRecipients: {
                    fileType: "csv",
                    url: ""
                },
                usersForMentions:  null,
            };
    
            await ctx.render("editor.ejs", argss)
        }
        catch (ex) {
            console.log(ex);
            await ctx.render("error.ejs", { message: "Server error" });
        }
    }
}

module.exports = OfficePreviewController;