const router = require("express").Router(),
    Bcrypt = require("bcryptjs"),
    AdminBro = require('admin-bro'),
    AdminBroExpress = require('@admin-bro/express'),
    AdminBroMongoose = require('@admin-bro/mongoose');

AdminBro.registerAdapter(AdminBroMongoose);
// admin bro ressources
const User = require("./../models/user"),
    Bookmark = require("./../models/bookmark"),
    BookmarksList = require("./../models/bookmarksList");

const adminBro = new AdminBro({
    title: "hi",
    resources: [Bookmark, BookmarksList, {
        // customized ressource
        resource: User,
        options: {
            properties: {
                password: {
                    type: 'password',
                    isVisible: {
                        show: false, edit: true, filter: false, list: false
                    }
                },
            },
            actions: {
                new: {
                    before: (req) => {
                        if (req.payload.password) {
                            req.payload = {
                                ...req.payload,
                                password: Bcrypt.hashSync(req.payload.password),
                            }
                        }
                        return req
                    },
                },
            }
        }
    }],
    rootPath: '/secureAdminPath',
    loginPath: '/secureAdminPath/login',
    logoutPath: '/secureAdminPath/login'
});
const adminBroRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    cookiePassword: 'session Key',
    authenticate: async (email, password) => {
        const user = await User.findOne({ email });
        if (user && user.isAdministrator) {
            if (Bcrypt.compareSync(password, user.password)) return user;
        }
        return false;
    }
});

router.use(adminBro.options.rootPath, adminBroRouter);

module.exports = router; 