(function(){
  //width
  F = a.width        
  
  //height
  G = a.height
  
  //imageData
  H = c.createImageData( F, G )
  
  //hslData
  I = []
  
  //worms
  K = []
  
  //element painting enabled? earth/air/fire/water
  U = [ 1, 1, 1 ,1 ]          

  //element actions (hsl)
  X = [
    //earth modifies hue channel
    worm =>
      E( worm, [ 
        worm[ 4 ], 
        D( worm )[ 1 ], 
        D( worm )[ 2 ] 
      ]),
    //air increments lightness channel
    worm => 
      E( worm, [
        D( worm )[ 0 ],
        D( worm )[ 0 ],
        C( D( worm )[ 2 ] + 0.05, 0, 1 )
      ]),
    //fire decrements lightness channel
    worm => 
      E( worm, [
        D( worm )[ 0 ],
        D( worm )[ 1 ],
        C( D( worm )[ 2 ] - 0.05, 0, 1 )
      ]),  
    //water modifies saturation channel
    worm =>
      E( worm, [ 
        D( worm )[ 0 ], 
        worm[ 4 ], 
        D( worm )[ 2 ] 
      ])                
  ]      

  //initial fill color (HSL)
  J = [ 
    Math.random(), 
    Math.random(), 
    Math.random()
  ]           
  
  //element button colors (RGB)
  W = [
    //earth
    [ 79, 149, 51 ],
    //air
    [ 212, 223, 230 ],
    //fire
    [ 255, 100, 51 ],
    //water
    [ 51, 153, 255 ]
  ]
  
  //hslToRgb        
  A = ( b, d, e ) => {
    b *= 6
    
    d = [ 
      e += d *= .5 > e ? e : 1 - e, 
      e - b % 1 * d * 2, 
      e -= d *= 2, 
      e, 
      e + b % 1 * d, 
      e + d 
    ]
    
    return [ 
      255 * d[ ~~b % 6 ], 
      255 * d[ ( b | 16 ) % 6 ], 
      255 * d[ ( b | 8 ) % 6 ],
      255
    ]
  } 
  
  //wrap
  B = ( b, d ) => {
    for( ; 0 > b; )
      b += d
    
    return b % d
  }        
  
  //clamp
  C = ( n, min, max ) => n < min ? min : n > max ? max : n
  
  //get (hsl)
  D = point => 
    I[ B( point[ 1 ], G ) * F + B( point[ 0 ], F ) ]

  //set (hsl)
  E = ( point, hsl ) => {
    //save to hueData
    I[ B( point[ 1 ], G ) * F + B( point[ 0 ], F ) ] = hsl
    
    //set imageData channels (rgb)
    for( m = 0; m < U.length; m++ )
      H.data[( 
        B( point[ 1 ], G ) * 
        F + 
        B( point[ 0 ], F ) 
      ) * 4 + m ] = C( A( hsl[ 0 ], hsl[ 1 ], hsl[ 2 ] )[ m ], 0, 255 )
  }
  
  //fill canvas
  for( i = 0; i < G; i++ )
    for( j = 0; j < F; j++ )
      E( [ j, i ], J )
  
  //tick                   
  T = elapsed => {          
    //each worm
    for( i = 0; i < K.length; i++ )
      //worm movements per tick
      for( j = 0; j < K[ i ][ 2 ]; j++ ){
        //move 0-1 pixels on each axis
        K[ i ][ 0 ] += ~~( Math.random() * 3 ) - 1
        K[ i ][ 1 ] += ~~( Math.random() * 3 ) - 1
        
        //action
        K[ i ][ 3 ]( K[ i ] )
        
        //blur              
          //find neighbours
          S = [
            [ K[ i ][ 0 ], K[ i ][ 1 ] - 1 ],
            [ K[ i ][ 0 ] - 1, K[ i ][ 1 ] ],
            K[ i ],
            //extra copy of current point to bias result
            K[ i ],
            [ K[ i ][ 0 ] + 1, K[ i ][ 1 ] ], 
            [ K[ i ][ 0 ], K[ i ][ 1 ] + 1 ]                
          ]
          
          //sum channels with neighbours (HSL)
          R = [ 0, 0, 0 ]                
          for( k = 0; k < S.length; k++ ){
            R[ 0 ] += D( S[ k ] )[ 0 ]
            R[ 1 ] += D( S[ k ] )[ 1 ]
            R[ 2 ] += D( S[ k ] )[ 2 ]
          }
          
          //normalize channels and paint (HSL)
          E( K[ i ], [ 
            C( R[ 0 ] / S.length, 0, 1 ),
            C( R[ 1 ] / S.length, 0, 1 ),
            C( R[ 2 ] / S.length, 0, 1 )
          ])
        //end blur    
      }
    
    //element select buttons
    for( k = 0; k < W.length; k++ ){
      for( i = 0; i < 50; i++ )
        for( j = k * 50; j < k * 50 + 50; j++ ){              
          //if element enabled draw button
          if( U[ k ] ){
            //red channel
            H.data[( 
              B( i, G ) * 
              F + 
              B( j, F ) 
            ) * 4 ] = W[ k ][ 0 ]
            
            //green channel
            H.data[( 
              B( i, G ) * 
              F + 
              B( j, F ) 
            ) * 4 + 1 ] = W[ k ][ 1 ]
            
            //blue channel
            H.data[( 
              B( i, G ) * 
              F + 
              B( j, F ) 
            ) * 4 + 2 ] = W[ k ][ 2 ]
          } 
          //draw background
          else {
            E( [ j, i ], D( [ j, i ] ) ) 
          }  
        }
    }

    //blit
    c.putImageData( H, 0, 0 )
    
    requestAnimationFrame( T )  
  }
  
  a.onclick = event => {
    //toggle buttons?
    if( event.clientX < 200 && event.clientY < 50 ){
      U[ ~~( event.clientX / 50 ) ] = !U[ ~~( event.clientX / 50 ) ]
    } 
    //new worm generation at click point
    else {
      //clear current worms
      K = []
      
      //number of worms per element
      N = [ 
        //earth count
        ~~( Math.random() * 50 ) + 1, 
        //air count
        ~~( Math.random() * 50 ) + 1, 
        //fire count
        ~~( Math.random() * 50 ) + 1, 
        //water count
        ~~( Math.random() * 50 ) + 1 
      ]
      
      //add worms for each element
      for( j = 0; j < U.length; j++ ){
        //add count for this element
        for( i = 0; U[ j ] && i < N[ j ]; i++ ){
          //add worm
          K[ K.length ] = [        
            //initial position
            event.clientX,
            event.clientY,
            //turns per tick
            ~~( Math.random() * 150 ) + 50,
            //draw action
            X[ j ],
            //value
            Math.random()
          ]        
        }             
      }
      
      //always add one extra worm that paints with the fill color
      K[ K.length ] = [  
        //initial position            
        event.clientX,
        event.clientY,
        //turns per tick
        ~~( Math.random() * 150 ) + 50,
        //colorise
        X[ 0 ],
        //current fill hue
        J[ 0 ]
      ]   
    }
  }
  
  //start
  T( 0 )
})()