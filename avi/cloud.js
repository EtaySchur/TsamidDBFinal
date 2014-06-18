
Parse.Cloud.define("modifyUser", function(request, response) {
    if (!request.user) {
        response.error("Must be signed in to call this Cloud Function.")
        return;
    }
    // The user making this request is available in request.user
    // Make sure to first check if this user is authorized to perform this change.
    // One way of doing so is to query an Admin role and check if the user belongs to that Role.
    // Replace !authorized with whatever check you decide to implement.
    //if (!authorized) {
    //  response.error("Not an Admin.")
    //  return;
    // }

    // The rest of the function operates on the assumption that request.user is *authorized*

    Parse.Cloud.useMasterKey();

    // Query for the user to be modified by username
    // The username is passed to the Cloud Function in a
    // key named "username". You can search by email or
    // user id instead depending on your use case.

    var query = new Parse.Query(Parse.User);
    query.equalTo("objectId", request.user.id);

    // Get the first user which matches the above constraints.
    query.first({
        success: function(anotherUser) {
            // Successfully retrieved the user.
            // Modify any parameters as you see fit.
            // You can use request.params to pass specific
            // keys and values you might want to change about
            // this user.

            //anotherUser.set(request.params.fieldName, request.params.fieldValue);
            request.params.forEach(function(field){
                anotherUser.set(field, request.params[field]);
            });

            // Save the user.
            anotherUser.save(null, {
                success: function(anotherUser) {
                    // The user was saved successfully.
                    response.success("Successfully updated user.");
                },
                error: function(gameScore, error) {
                    // The save failed.
                    // error is a Parse.Error with an error code and description.
                    response.error("Could not save changes to user.");
                }
            });
        },
        error: function(error) {
            response.error("Could not find user.");
        }
    });
});