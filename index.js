import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import * as DB from "./db.js"

const JWT_SECRET = "hello_world"

// const data = {
// 	username: "najimov",
// 	isAdmin: true,
// }

// const token = jwt.sign( data, SECRET, { expiresIn: "1h" } )

const server = express()

server.use( cors() )
server.use( express.json() )

server.post( "/login", ( req, res ) => {

	const { username, password } = req.body

	if ( !username || !password ) {

		res.status( 400 ).end()
		return
	}

	if ( !DB.users[ username ] ) {

		res.status( 401 ).end()
		return
	}

	const user = DB.users[ username ]

	if ( user.password !== password ) {

		res.status( 401 ).end()
		return
	}

	const payload = {
		username,
		isAdmin: user.isAdmin,
	}

	const token = jwt.sign( payload, JWT_SECRET, { expiresIn: "1h" } )

	res.status( 201 ).send( {
		username,
		name: user.name,
		token,
	} )
} )

server.listen( 3000, () => console.info( ":3000" ) )
