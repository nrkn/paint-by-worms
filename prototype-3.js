(function(){
  const width = a.width
  const height = a.height
  const imageData = c.createImageData( width, height )
  const hslData = []
  
  const hslToRgba = ( a, b, c ) => {
    a *= 6
    
    b = [
      c += b *= c < 0.5 ?
        c :
        1 - c,
        
      c - a % 1 * b * 2,
      
      c -= b *= 2,
      
      c,
      
      c + a % 1 * b,
      
      c + b
    ]
    
    return[
      b[ ~~a    % 6 ] * 255,
      b[ (a|16) % 6 ] * 255,
      b[ (a|8)  % 6 ] * 255,
      255
    ]
  } 
  
  const wrap = ( n, length ) => {
    while( n < 0 ) n += length
    
    return n % length
  }        

  const wrapX = x => wrap( x, width )
  const wrapY = y => wrap( y, height )
  
  const clamp = ( n, min, max ) => n < min ? min : n > max ? max : n
  
  const get = point => 
    hslData[ wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ]

  const set = ( point, hsl ) => {
    hslData[ wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ] = hsl
    
    imageData.data[ ( wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ) * 4 ] = clamp( hslToRgba( hsl[ 0 ], hsl[ 1 ], hsl[ 2 ] )[ 0 ], 0, 255 )
    imageData.data[ ( wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ) * 4 + 1 ] = clamp( hslToRgba( hsl[ 0 ], hsl[ 1 ], hsl[ 2 ] )[ 1 ], 0, 255 )
    imageData.data[ ( wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ) * 4 + 2 ] = clamp( hslToRgba( hsl[ 0 ], hsl[ 1 ], hsl[ 2 ] )[ 2 ], 0, 255 )
    imageData.data[ ( wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ) * 4 + 3 ] = clamp( hslToRgba( hsl[ 0 ], hsl[ 1 ], hsl[ 2 ] )[ 3 ], 0, 255 )
  }
  
  const neighbours = point => [
    [ point[ 0 ] - 1, point[ 1 ] - 1 ],
    [ point[ 0 ], point[ 1 ] - 1 ],
    [ point[ 0 ] + 1, point[ 1 ] - 1 ],
    
    [ point[ 0 ] - 1, point[ 1 ] ],
    [ point[ 0 ], point[ 1 ] ],
    [ point[ 0 ] + 1, point[ 1 ] ],
    
    [ point[ 0 ] - 1, point[ 1 ] + 1 ],
    [ point[ 0 ], point[ 1 ] + 1 ],
    [ point[ 0 ] + 1, point[ 1 ] + 1 ]
  ]
  
  const randomHslColor = () => [ 
    Math.random(), 
    Math.random(), 
    Math.random()
  ]
    
  const lightenColor = hsl => [
    hsl[ 0 ],
    hsl[ 1 ],
    clamp( hsl[ 2 ] + 0.05, 0, 1 )
  ]
    
  const darkenColor = hsl => [
    hsl[ 0 ],
    hsl[ 1 ],
    clamp( hsl[ 2 ] - 0.05, 0, 1 )
  ]

  const lighten = point =>
    set( point, lightenColor( get( point ) ) )      
    
  const darken = point =>
    set( point, darkenColor( get( point ) ) )      
            
  const hueLeftColor = hsl => [
    wrap( hsl[ 0 ] - 0.05, 1 ),
    hsl[ 1 ],
    hsl[ 2 ]
  ]
  
  const hueRightColor = hsl => [
    wrap( hsl[ 0 ] + 0.05, 1 ),
    hsl[ 1 ],
    hsl[ 2 ]
  ]
  
  const hueLeft = point =>
    set( point, hueLeftColor( get( point ) ) )      
    
  const hueRight = point =>
    set( point, hueRightColor( get( point ) ) )          
  
  const hueShift = worm =>
    set( worm, [ worm[ 4 ] = wrap( worm[ 4 ] + 0.0001, 1 ), get( worm )[ 1 ], get( worm )[ 2 ] ] )
    
  const saturate = worm =>
    set( worm, [ get( worm )[ 0 ], worm[ 4 ], get( worm )[ 2 ] ] )
    
  const colorise = worm =>
    set( worm, [ worm[ 4 ], get( worm )[ 1 ], get( worm )[ 2 ] ] )
    
  const luminate = worm =>
    set( worm, [ get( worm )[ 0 ], get( worm )[ 1 ], worm[ 4 ] ] )
    
  const blurPixel = point => {
    const n = neighbours( point )
    
    n[ n.length ] = point
    
    let h = 0
    let s = 0
    let l = 0
    
    for( var i = 0; i < n.length; i++ ){
      h += get( n[ i ] )[ 0 ]
      s += get( n[ i ] )[ 1 ]
      l += get( n[ i ] )[ 2 ]
    }
    
    return [ 
      clamp( h / n.length, 0, 1 ),
      clamp( s / n.length, 0, 1 ),
      clamp( l / n.length, 0, 1 )
    ]  
  }
  
  const blur = point =>
    set( point, blurPixel( point ) )
    
  const move = point => {
    point[ 0 ] += ~~( Math.random() * 3 ) - 1
    point[ 1 ] += ~~( Math.random() * 3 ) - 1
  }   
  
  let worms = []
  let hsl = randomHslColor()
  
  for( var y = 0; y < height; y++ ){
    for( var x = 0; x < width; x++ ){
      set( [ x, y ], hsl )
    }
  }           
  
  // Main loop 
  // -=-=-=-=-=-=-=-=-=-                     
  const tick = elapsed => {          
    for( var w = 0; w < worms.length; w++ )
      for( var i = 0; i < worms[ w ][ 2 ]; i++ )
        for( var f = 0; f < worms[ w ][ 3 ].length; f++ )
          worms[ w ][ 3 ][ f ]( worms[ w ] )

    c.putImageData( imageData, 0, 0 )
    
    requestAnimationFrame( tick )  
  }
  
  a.onclick = event => {
    worms = []
    
    let wormMax = ~~( Math.random() * 50 )
    let speedMax = ~~( Math.random() * 50 ) + 150        

    let satCount = ~~( Math.random() * wormMax )
    let lumCount = ~~( Math.random() * wormMax )
    let lightCount = ~~( Math.random() * wormMax )
    let darkCount = ~~( Math.random() * wormMax )
    let hueLeftCount = ~~( Math.random() * wormMax )
    let hueRightCount = ~~( Math.random() * wormMax )
    let hueCount = ~~( Math.random() * wormMax / 5 )
    let hueShiftCount = ~~( Math.random() * wormMax )                  
    
    for( var i = 0; i < darkCount; i++ ){
      worms[ worms.length ] = [        
        event.clientX,
        event.clientY,
        ~~( Math.random() * speedMax ),
        [
          move,
          darken,
          blur
        ],
        Math.random()
      ]         
    }
    
    for( var i = 0; i < lightCount; i++ ){
      worms[ worms.length ] = [        
        event.clientX,
        event.clientY,
        ~~( Math.random() * speedMax ),
        [
          move,
          lighten,
          blur
        ],
        Math.random()
      ]          
    }          
    
    for( var i = 0; i < satCount; i++ ){
      worms[ worms.length ] = [        
        event.clientX,
        event.clientY,
        ~~( Math.random() * speedMax ),
        [
          move,
          saturate,
          blur
        ],
        Math.random()
      ]        
    } 
   
    for( var i = 0; i < hueCount; i++ ){
      worms[ worms.length ] = [        
        event.clientX,
        event.clientY,
        ~~( Math.random() * speedMax ),
        [
          move,
          colorise,
          blur
        ],
        Math.random()
      ]        
    }  

    worms[ worms.length ] = [        
      event.clientX,
      event.clientY,
      ~~( Math.random() * speedMax ),
      [
        move,
        colorise,
        blur
      ],
      hsl[ 0 ]
    ]             
  }
  
  //start
  tick( 0 )
})()