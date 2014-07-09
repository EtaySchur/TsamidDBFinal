/**
 * Created by etayschur on 7/9/14.
 */

var SuperTranslator = function() {
    this._hebrew = {
        // Games Translations
        intro: "משחק היכרות",
        tour: "טיול עולם",
        trivia: "טריוויה",
        // Content Translations
        document: "מסמך גוגל",
        presentation:"מצגת ",
        video:"וידיאו",
        // User Translations
        male: "זכר",
        female: "נקבה",
        // Favorites Translations
        hobby: "תחביב",
        food: "מאכל",
        animal:"חיה",
        movie:"סרט",
        music:"מוסיקה"
    }
};

SuperTranslator.prototype.hebrewTranslate = function (string){
    return this._hebrew[string];
}

