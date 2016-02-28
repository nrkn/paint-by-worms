(function(){
  'use strict'
  
  const width = a.width
  const height = a.height
  const imageData = c.createImageData( width, height )
  const data = imageData.data        
  const hslData = []
  
  const hslaToRgba = ( a, b, c, d ) => {
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
      d * 255
    ]
  } 

  const rgbaToHsla = ( r, g, b, a ) => {
    r /= 255
    g /= 255
    b /= 255
    a /= 255
    
    const max = Math.max( r, g, b )
    const min = Math.min( r, g, b )
    
    let h, s, l = ( max + min ) / 2

    if( max == min ){
      h = s = 0
    } else {
      var d = max - min
      s = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min )
      
      switch( max ){
        case r: h = ( g - b ) / d + ( g < b ? 6 : 0 ); break;
        case g: h = ( b - r ) / d + 2; break;
        case b: h = ( r - g ) / d + 4; break;
      }
      
      h /= 6
    }

    return [ h, s, l, a ]
  }        
  
  const wrap = ( n, length ) => Math.abs( n ) % length
  const wrapX = x => wrap( x, width )
  const wrapY = y => wrap( y, height )
  
  const clamp = ( n, min, max ) => n < min ? min : n > max ? max : n
  
  const get = point => 
    hslData[ wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ]

  const set = ( point, hsla ) => {
    hslData[ wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ] = hsla
    
    const rgba = hslaToRgba( hsla[ 0 ], hsla[ 1 ], hsla[ 2 ], hsla[ 3 ] )
    
    const r = ( wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ) * 4              
    const g = r + 1
    const b = g + 1
    const a = b + 1          
    
    data[ r ] = clamp( rgba[ 0 ], 0, 255 )
    data[ g ] = clamp( rgba[ 1 ], 0, 255 )
    data[ b ] = clamp( rgba[ 2 ], 0, 255 )
    data[ a ] = clamp( rgba[ 3 ], 0, 255 )
  }
  
  const getRgba = point => {
    const r = ( wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ) * 4              
    const g = r + 1
    const b = g + 1
    const a = b + 1      

    return[ data[ r ], data[ g ], data[ b ], data[ a ] ]
  }
  
  const setRgba = ( point, rgba ) => {
    const hsla = rgbaToHsla( 
      clamp( rgba[ 0 ], 0, 255 ), 
      clamp( rgba[ 1 ], 0, 255 ), 
      clamp( rgba[ 2 ], 0, 255 ),
      clamp( rgba[ 3 ], 0, 255 )         
    )

    hslData[ wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ] = hsla
    
    const r = ( wrapY( point[ 1 ] ) * width + wrapX( point[ 0 ] ) ) * 4              
    const g = r + 1
    const b = g + 1
    const a = b + 1          
    
    data[ r ] = clamp( rgba[ 0 ], 0, 255 )
    data[ g ] = clamp( rgba[ 1 ], 0, 255 )
    data[ b ] = clamp( rgba[ 2 ], 0, 255 )
    data[ a ] = clamp( rgba[ 3 ], 0, 255 )          
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
  
  const randomHslColor = () => [ 
    Math.random(), 
    Math.random(), 
    Math.random(), 
    1
  ]

  const randomHsl = point => 
    set( point, randomHslColor() ) 
    
  const lightenColor = hsla => [
    hsla[ 0 ],
    hsla[ 1 ],
    clamp( hsla[ 2 ] + 0.05, 0, 1 ),
    hsla[ 3 ]
  ]
    
  const darkenColor = hsla => [
    hsla[ 0 ],
    hsla[ 1 ],
    clamp( hsla[ 2 ] - 0.05, 0, 1 ),
    hsla[ 3 ]
  ]

  const lighten = point =>
    set( point, lightenColor( get( point ) ) )      
    
  const darken = point =>
    set( point, darkenColor( get( point ) ) )      
          
  const randomHueColor = hsla => [
    Math.random(),
    hsla[ 1 ],
    hsla[ 2 ],
    hsla[ 3 ]          
  ]
  
  const randomHue = point =>
    set( point, randomHueColor( get( point ) ) )   
    
  const hueShift = worm => {
    const hsla = get( worm )
    
    const hue = worm[ 4 ] = wrap( worm[ 4 ] + 0.0001, 1 )
    
    set( worm, [ hue, hsla[ 1 ], hsla[ 2 ], hsla[ 3 ] ] )
  }             
    
  const colorise = worm => {
    const hsla = get( worm )
    
    const hue = worm[ 4 ]
    
    set( worm, [ hue, hsla[ 1 ], hsla[ 2 ], hsla[ 3 ] ] )
  }          
    
  const saturate = worm => {
    const hsla = get( worm )
    
    const saturation = worm[ 4 ]
    
    set( worm, [ hsla[ 0 ], saturation, hsla[ 2 ], hsla[ 3 ] ] )
  }           
    
  const luminate = worm => {
    const hsla = get( worm )
    
    const lightness = worm[ 4 ]
    
    set( worm, [ hsla[ 0 ], hsla[ 1 ], lightness, hsla[ 3 ] ] )
  }           
    
  const blurPixel = point => {
    const n = neighbours( point )
    
    n[ n.length ] = point
    
    let r = 0
    let g = 0
    let b = 0
    
    for( var i = 0; i < n.length; i++ ){
      const rgba = getRgba( n[ i ] )
      
      r += rgba[ 0 ]
      g += rgba[ 1 ]
      b += rgba[ 2 ]
    }
    
    return [ 
      ~~( r / n.length ),
      ~~( g / n.length ),
      ~~( b / n.length ),
      getRgba( point )[ 3 ]
    ]  
  }
  
  const blur = point =>
    setRgba( point, blurPixel( point ) )                      
    
  const move = point => {
    const offX = ~~( Math.random() * 3 ) - 1
    const offY = ~~( Math.random() * 3 ) - 1
    point[ 0 ] += offX
    point[ 1 ] += offY
  }  
  
  const worms = []
  
  const wormMax = ~~( Math.random() * 100 )
  const speedMax = ~~( Math.random() * 100 )
  
  const satCount = ~~( Math.random() * wormMax )
  const lightCount = ~~( Math.random() * wormMax )
  const darkCount = ~~( Math.random() * wormMax )
  const hueCount = ~~( Math.random() * wormMax )
  
  for( var i = 0; i < satCount; i++ ){
    worms[ worms.length ] = [        
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
      ~~( Math.random() * speedMax ),
      [
        move,              
        saturate,
        blur
      ],
      Math.random()
    ]         
  }
          
  for( var i = 0; i < darkCount; i++ ){
    worms[ worms.length ] = [        
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
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
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
      ~~( Math.random() * speedMax ),
      [
        move,
        lighten,
        blur
      ],
      Math.random()
    ]          
  }
  
  for( var i = 0; i < hueCount; i++ ){
    worms[ worms.length ] = [        
      ~~( Math.random() * width ),
      ~~( Math.random() * height ),
      ~~( Math.random() * speedMax ),
      [
        move,
        hueShift,
        blur
      ],
      Math.random()
    ]        
  }
  
  // Main loop 
  // -=-=-=-=-=-=-=-=-=-                     
  const tick = elapsed => {          
    // IO
    // -=-=-=-=-=-=-=-=-=-
    
    if( elapsed === 0 ) {     
      const hsla = randomHslColor()
      for( var y = 0; y < height; y++ ){
        for( var x = 0; x < width; x++ ){
          set( [ x, y ], hsla )
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
    
    requestAnimationFrame( tick )  
  }
  
  //start
  tick( 0 )
})()