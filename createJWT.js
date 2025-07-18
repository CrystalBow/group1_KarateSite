const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function (id, name, email, rank, progressW, progressY, progressO)
{
    return _createToken(id, name, email, rank, progressW, progressY, progressO);
}
// Token creatition
_createToken = function (id, name, email, rank, progressW, progressY, progressO )
{
    try 
    {
        const expiration = new Date();
        const user = {id, name, email, rank, progressW, progressY, progressO};
        const accessToken = jwt.sign( user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'});

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
    var name = ud.payload.name;
    var email = ud.payload.email;
    var rank = ud.payload.rank;
    var progressW = ud.payload.progressW;
    var progressY = ud.payload.progressY;
    var progressO = ud.payload.progressO;

    return _createToken(id, name, email, rank, progressW, progressY, progressO );
}