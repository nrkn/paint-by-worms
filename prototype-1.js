(function(){
  'use strict'
  
  const width = a.width
  const height = a.height
  const imageData = c.createImageData( width, height )
  const data = imageData.data        
  
  let last = 0
  
  const wrap = ( n, length ) => n < 0 ? n + length : n % length
  const wrapX = x => wrap( x, width )
  const wrapY = y => wrap( y, height )
  
  const clamp = ( n, min, max ) => n < min ? min : n > max ? max : n
  
  const get = point => {
    const r = ( wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ) * 4              
    const g = r + 1
    const b = g + 1
    const a = b + 1
    
    return [ data[ r ], data[ g ], data[ b ], data[ a ] ]
  }

  const set = ( point, rgba ) => {
    const r = ( wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ) * 4              
    const g = r + 1
    const b = g + 1
    const a = b + 1
    
    data[ r ] = clamp( rgba[ 0 ], 0, 255 )
    data[ g ] = clamp( rgba[ 1 ], 0, 255 )
    data[ b ] = clamp( rgba[ 2 ], 0, 255 )
    data[ a ] = clamp( rgba[ 3 ], 0, 255 )
  }
  
  const randomColor = () => [ 
    ~~( Math.random() * 255 ), 
    ~~( Math.random() * 255 ), 
    ~~( Math.random() * 255 ), 
    255 
  ]

  const randomGreyColor = () => {
    const grey = ~~( Math.random() * 255 )
    
    return [ grey, grey, grey, 255 ]
  }
  
  const randomRedColor = () => {
    const red = ~~( Math.random() * 255 )
    const grey = ~~( Math.random() * red )
    
    return [ red, grey, grey, 255 ]
  }

  const randomGreenColor = () => {
    const green = ~~( Math.random() * 255 )
    const grey = ~~( Math.random() * green )
    
    return [ grey, green, grey, 255 ]
  }
  
  const randomBlueColor = () => {
    const blue = ~~( Math.random() * 255 )
    const grey = ~~( Math.random() * blue )
    
    return [ grey, grey, blue, 255 ]
  }
  
  const lightenColor = rgba => {
    const r = ~~( rgba[ 0 ] * 1.1 )
    const g = ~~( rgba[ 1 ] * 1.1 )
    const b = ~~( rgba[ 2 ] * 1.1 )
    const a = rgba[ 3 ]
    
    return [ r, g, b, a ]
  }

  const darkenColor = rgba => {
    const r = ~~( rgba[ 0 ] * 0.9 )
    const g = ~~( rgba[ 1 ] * 0.9 )
    const b = ~~( rgba[ 2 ] * 0.9 )
    const a = rgba[ 3 ]
    
    return [ r, g, b, a ]
  }

  const random = point => 
    set( point, randomColor() )
    
  const randomGrey = point =>
    set( point, randomGreyColor() )
    
  const randomRed = point =>
    set( point, randomRedColor() )
    
  const randomGreen = point =>
    set( point, randomGreenColor() )
    
  const randomBlue = point =>
    set( point, randomBlueColor() )
    
  const lighten = point => {
    const current = get( point )
    set( point, lightenColor( current ) )
  }  
    
  const darken = point => {
    const current = get( point )
    set( point, darkenColor( current ) )
  }  
  
  const move = point => {
    const offX = ~~( Math.random() * 3 ) - 1
    const offY = ~~( Math.random() * 3 ) - 1
    point[ 0 ] += offX
    point[ 1 ] += offY
  }
  
  const neighbours = point => {
    const x = point[ 0 ]
    const y = point[ 1 ]
    
    const left = x - 1
    const right = x + 1
    const top = y - 1
    const bottom = y + 1
    
    return [
      [ left, top ],
      [ x, top ],
      [ right, top ],
      
      [ left, y ],
      [ x, y ],
      [ right, y ],
      
      [ left, bottom ],
      [ x, bottom ],
      [ right, bottom ]
    ]
  }
  
  const blurPixel = point => {
    const x = point[ 0 ]
    const y = point[ 1 ]
    
    const n = neighbours( point )
    
    let r = 0
    let g = 0
    let b = 0
    const a = 255
    
    for( var i = 0; i < n.length; i++ ){
      const color = get( n[ i ] )
      
      r += color[ 0 ]
      g += color[ 1 ]
      b += color[ 2 ]
    }
    
    return [ 
      ~~( r / n.length ),
      ~~( g / n.length ),
      ~~( b / n.length ),
      a
    ]  
  }
  
  const blur = point =>
    set( point, blurPixel( point ) )   

  const blurBlur = point => {
    set( point, blurPixel( point ) )   
    set( point, blurPixel( point ) )   
  }
  
  const worms = []
          
  for( var i = 0; i < 2; i++ ){                   
    worms[ worms.length ] = [        
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
      ~~( Math.random() * 200 ),
      [
        move,
        randomRed
      ]
    ]

    worms[ worms.length ] = [        
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
      ~~( Math.random() * 200 ),
      [
        move,
        randomGreen
      ]
    ]
    
    worms[ worms.length ] = [        
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
      ~~( Math.random() * 200 ),
      [
        move,
        randomBlue
      ]
    ]
  }        
  
  for( var i = 0; i < 5; i++ ){ 
    worms[ worms.length ] = [        
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
      ~~( Math.random() * 200 ),
      [
        move,
        randomGrey
      ]
    ]
  }
  
  for( var i = 0; i < 10; i++ ){   
    worms[ worms.length ] = [        
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
      ~~( Math.random() * 200 ),
      [
        move,
        random
      ]
    ]
  }
  
  for( var i = 0; i < 15; i++ ){
    worms[ worms.length ] = [        
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
      ~~( Math.random() * 200 ),
      [
        move,
        lighten
      ]
    ]
    
    worms[ worms.length ] = [        
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
      ~~( Math.random() * 200 ),
      [
        move,
        darken
      ]
    ] 
  }

  for( var i = 0; i < 80; i++ ){
    worms[ worms.length ] = [        
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
      ~~( Math.random() * 200 ),
      [
        move,
        blurBlur
      ]
    ]            
  }  
  
  for( var i = 0; i < 120; i++ ){
    worms[ worms.length ] = [        
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
      ~~( Math.random() * 200 ),
      [
        move,
        blur
      ]
    ]            
  }  
  
  // Main loop 
  // -=-=-=-=-=-=-=-=-=-                     
  const tick = elapsed => {          
    // IO
    // -=-=-=-=-=-=-=-=-=-
    
    if( elapsed === 0 ) {
      for( var y = 0; y < height; y++ ){
        for( var x = 0; x < width; x++ ){
          random( [ x, y ] )
        }
      }
    } else {
      for( var w = 0; w < worms.length; w++ ){
        for( var i = 0; i < worms[ w ][ 2 ]; i++ ){
          for( var f = 0; f < worms[ w ][ 3 ].length; f++ ){
            worms[ w ][ 3 ][ f ]( worms[ w ] )
          }
        }  
      }
    }            
    
    c.putImageData( imageData, 0, 0 )
    
    //admin
    last = elapsed          
    requestAnimationFrame( tick )  
  }
  
  //start
  tick( last )
})()