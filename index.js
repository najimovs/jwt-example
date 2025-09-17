import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import * as DB from "./db.js"

const JWT_SECRET = process.env.JWT_SECRET

const server = express()

server.use( cors() )
server.use( express.json() )

server.get( "/posts", ( req, res ) => {

	if ( !req.headers.authorization ) {

		res.status( 401 ).end()
		return
	}

	try {

		const token = req.headers.authorization.split( " " )[ 1 ]

		jwt.verify( token, JWT_SECRET )

		res.send( DB.posts )
	}
	catch( error ) {

		res.status( 401 ).end()
		return
	}
} )

server.post( "/posts", ( req, res ) => {

	if ( !req.headers.authorization ) {

		res.status( 401 ).end()
		return
	}

	try {

		const token = req.headers.authorization.split( " " )[ 1 ]

		const user = jwt.verify( token, JWT_SECRET )

		const permissions = DB.permissions[ user.username ]

		if ( !permissions || !permissions.includes( 1 ) ) {

			res.status( 403 ).end()
			return
		}

		DB.posts.push( req.body.value )

		res.status( 201 ).end()
	}
	catch( error ) {

		res.status( 401 ).end()
		return
	}
} )

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

	const token = jwt.sign( payload, JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 } )

	res.status( 201 ).send( {
		username,
		name: user.name,
		token,
	} )
} )

server.listen( 3000, () => console.info( ":3000" ) )
