const generateScript = require('./login_script.js')

module.exports = (oauth2, oauthProvider) => {
    function callbackMiddleWare (req, res, next) {
          const code = req.query.code
          var options = {
                  code: code
          }

      if (oauthProvider === 'gitlab') {
              options.client_id = process.env.OAUTH_CLIENT_ID
              options.client_secret = process.env.OAUTH_CLIENT_SECRET
              options.grant_type = 'authorization_code'
              options.redirect_uri = process.env.REDIRECT_URL
      }

      oauth2.getToken(options)
            .then(result => {
                      const token = oauth2.createToken(result)
                      const accessToken = token.token.token.access_token
                      if (!accessToken) {
                                  return { message: 'error', content: 'No access_token received from GitHub' }
                      }
                      content = {
                                  token: accessToken,
                                  provider: oauthProvider
                      }
                      return { message: 'success', content }
            })
            .catch(error => {
                      console.error('Access Token Error', error.message)
                      return { message: 'error', content: JSON.stringify(error) }
            })
            .then(result => {
                      const script = generateScript(oauthProvider, result.message, result.content)
                      return res.send(script)
            })
    }
    return callbackMiddleWare
}
