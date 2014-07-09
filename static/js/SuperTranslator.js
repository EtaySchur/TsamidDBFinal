/**
 * Created by etayschur on 7/9/14.
 */

var SuperTranslator = function() {
    this._hebrew = {
        // Games Translations
        intro: "משחק היכרות",
        tour: "טיול עולם",
        trivia: "טריוויה",
        // Content
        document: "מסמך גוגל",
        presentation:"מצגת ",
        video:"וידיאו",
        // User
        male: "זכר",
        female: "נקבה"



    }
};

SuperTranslator.prototype.hebrewTranslate = function (string){
    return this._hebrew[string];
}

