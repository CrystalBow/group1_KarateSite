const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function (id, user, name, email, rank, streak, progressW, progressY, progressO)
{
    return _createToken(id, user, name, email, rank, streak, progressW, progressY, progressO);
}
// Token creatition
_createToken = function (id, user, name, email, rank, streak, progressW, progressY, progressO )
{
    try 
    {
        const expiration = new Date();
        const account = {id, user, name, email, rank, streak, progressW, progressY, progressO};
        const accessToken = jwt.sign( account, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'});

        var ret = {accessToken:accessToken};
    }
    catch(e)
    {
        var ret = {error:e.message};
    }
    return ret;
}
// Determine of token is expired
exports.isExpired = function( token )
{
    var isError = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET,
        (err, verifiedJwt) =>
    {
        if( err )
        {
            return true;
        }
        else
        {
            return false;
        }
    });

    return isError;
}

exports.refresh = function( token )
{
    var ud = jwt.decode(token,{complete:true});
    var id = ud.payload.id;
    var user = ud.payload.user;
    var name = ud.payload.name;
    var email = ud.payload.email;
    var rank = ud.payload.rank;
    var streak = ud.payload.streak;
    var progressW = ud.payload.progressW;
    var progressY = ud.payload.progressY;
    var progressO = ud.payload.progressO;

    return _createToken(id, user, name, email, rank, streak, progressW, progressY, progressO );
}