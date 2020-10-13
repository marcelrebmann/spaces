db.createUser({
    user: "spaces",
    pwd: "sp123-U",
    roles: [
        {
            role: "readWrite",
            db: "spaces"
        }
    ]
})