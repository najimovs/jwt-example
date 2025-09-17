import express from "express"
import cors from "cors"

const SECRET = "hello_world"

const server = express()

server.use( cors() )

server.get( "/secret-data", ( req, res ) => {

	if ( req.headers.token === SECRET ) {

		res.send( {
			secret: "data",
		} )
	}
	else {

		res.status( 401 ).end()
	}
} )

server.listen( 3000, () => console.info( ":3000" ) )
