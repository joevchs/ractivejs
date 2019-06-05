var ractive, xmen;

// define our superheroes
xmen = [
  { name: 'Nightcrawler', realname: 'Wagner, Kurt',     power: 'Teleportation',    info: 'http://www.superherodb.com/Nightcrawler/10-107/' },
  { name: 'Cyclops',      realname: 'Summers, Scott',   power: 'Optic blast',      info: 'http://www.superherodb.com/Cyclops/10-50/' },
  { name: 'Rogue',        realname: 'Marie, Anna',      power: 'Absorbing powers', info: 'http://www.superherodb.com/Rogue/10-831/' },
  { name: 'Wolverine',    realname: 'Howlett, James',   power: 'Regeneration',     info: 'http://www.superherodb.com/Wolverine/10-161/' }
];

var ractive = new Ractive({
    target: '#target',
    template: '#template',
    data: {
        items: [
            { done: true,  description: 'Add a todo item' },
            { done: false, description: 'Add some more todo items' },
            { done: false, description: 'Complete all the Ractive tutorials' }
        ],
        yachts: [
            { name: 'Larry\'s Little Lady', type: 'yacht', owner: { type: 'business', name: 'Oracle', classifier: 'Co' } },
            { name: 'SS Minnow Johnson', type: 'yacht', owner: { type: 'person', givenName: 'Lawrence', familyName: 'Wall' } },
            { name: 'Le Grande Divorcee', type: 'yacht', owner: { type: 'business', name: 'Mr. Lawyer', classifier: 'LLC' } }
        ],

        country: {
            name: 'The UK',
            climate: { temperature: 'cold', rainfall: 'excessive' }, // Nested Properties
            population: 63230000,
            capital: { name: 'London', lat: 51.5171, lon: -0.1062 },
            format: function ( num ) {
                if ( num > 1000000000 ) return ( num / 1000000000 ).toFixed( 1 ) + ' billion';
                if ( num > 1000000 ) return ( num / 1000000 ).toFixed( 1 ) + ' million';
                if ( num > 1000 ) return ( Math.floor( num / 1000 ) ) + ',' + ( num % 1000 );
                return num;
            },
            price: 12.0000,
            currency: function ( num ) {
                if ( num < 1 ) return ( 100 * num ) + 'p';
                return '£' + num.toFixed( 2 );
            }
        },

        red: 0.45,
        green: 0.61,
        blue: 0.2,

        number: 0,

        me: { cows: 0 },
        sibling: { cows: 0 },
      
        user: {
			name: 'Joe'
        },
        
        signedIn: false,
        notSignedIn: true,
        role: null,

        superheroes: xmen,
        sortColumn: 'name',
        sort: function( array ) {
            // grab the current sort column
            var column = this.get( 'sortColumn' );
        
            // clone the array so as not to modify the underlying data
            var arr = array.slice();
            
            return arr.sort( function( a, b ) {
                return a[ column ] < b[ column ] ? -1 : 1;
            });
        },

        checked: false,
        colors: [ 'red', 'green', 'blue' ],
        color: 'red',

        content: '<strong>Spot the difference?</strong>',

        // placeholder image data
        image: {
            src: '/img/gifs/problem.gif',
            caption: 'Trying to work out a problem after the 5th hour'
        },

        scale: function ( val ) {
            // quick and dirty...
            return 2 * Math.abs( val );
        },
        formatBar: function ( val ) {
            // Pro-tip: we're using `this.get()` inside this function -
            // as a result, Ractive knows that this computation depends
            // on the value of `degreeType` as well as `val`
            if ( this.get( 'degreeType' ) === 'fahrenheit' ) {
              // convert celsius to fahrenheit
              val = ( val * 1.8 ) + 32;
            }
      
            return val.toFixed( 1 ) + '°';
        },
        getColor: function ( val ) {
            // quick and dirty function to pick a colour - the higher the
            // temperature, the warmer the colour
            var r = Math.max( 0, Math.min( 255, Math.floor( 2.56 * ( val + 50 ) ) ) );
            var g = 100;
            var b = Math.max( 0, Math.min( 255, Math.floor( 2.56 * ( 50 - val ) ) ) );
      
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        },
        monthNames: [ 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D' ],

        visible: 1

    },
    signIn: function () {
        var name = prompt( 'Enter your username to sign in', 'ractive_fan' );
  
        ractive.set({
            username: name,
            signedIn: true,
            notSignedIn: false,
            role: 'admin'
        });
    },
    sort: function( column ) {
        // update the sort column
        this.set('sortColumn', column);
    },

    addItem: function ( description ) {
        this.push( 'items', {
            description: description,
            done: false
        });
    },
    removeItem: function ( index ) {
        this.splice( 'items', index, 1 );
    },
    editItem: function ( index ) {
    },
    // instance event handlers
    on: {
        newTodo: function ( ctx ) {
            this.addItem( ctx.node.value );
            ctx.node.value = '';
            setTimeout( function () {
                ctx.node.focus();
            });
        },
        edit: function ( ctx ) {
            var keydownHandler, blurHandler, input, currentDescription;
        
            currentDescription = ctx.get( '.description' );
                ctx.set( '.editing', true );
        
            input = this.find( '.edit' );
            input.select();
            input.currentDescription = currentDescription;
        }
    },
    enterExit: function ( ev, ctx ) {
        if ( ev.which === 13 ) { // ENTER
            ctx.node.blur();
        } else if ( ev.which === 27 ) { // ESCAPE
            var node = ctx.node;
            node.value = node.currentDescription;
            ctx.set( '.description', node.value );
            node.blur();
        }
    },
    partials: {
        name: '{{>`${.type}-name`}}',
        'yacht-name': '{{.name}}',
        'business-name': '{{.name}}{{.classifier ? `, ${.classifier}` : ""}}',
        'person-name': '{{.familyName}}, {{.givenName}}{{.suffix ? ` ${.suffix}` : ""}}'
    },

    observe: {
        'selectedIndex': {
            handler: function ( index ) {
                this.animate( 'selectedCity', this.get( 'cities.' + index ), {
                    easing: 'easeOut'
                });
            },
            init: false
        }
    }
  });
  

// Updating nested properties
// we didn't store a reference, so let's do it now
var country = ractive.get('country');

country.climate.rainfall = 'very high';
ractive.update('country');

// easier
ractive.set('country.climate.rainfall', 'too much');


ractive.animate('red', 0.8);


/* 
Ractive.js also provides its own instance-level event system, so that you can raise and respond to internal events in a more abstract way. 
You can name your events however you like, so you can convey more meaning about the intent of the action that triggered the event, 
such as addUser as opposed to click.
*/
ractive.on( 'activates', function ( context ) {
	// `this` is the ractive instance
  // `context` is a context object
  // any additional event arguments would follow `context`, if supplied
  alert( 'Activating!' );
});

// You can subscribe to multiple instance events in one go:
var listener = ractive.on({
	activate: function(ctx, user) { 
        alert( 'Activating ' + user.name + '!');
        ractive.toggle( 'checked' );
    },
	deactivate: function() {
        alert( 'Deactivating!');
    }
});

ractive.on({
	toggle: function () {
		if ( listener.isSilenced() ) {
			listener.resume();
			this.set( 'silenced', false );
		} else {
			listener.silence();
			this.set( 'silenced', true );
		}
	}
});

// If you remove your ractive from the DOM with ractive.teardown(), any event handlers will be automatically cleaned up

// You can use array notation to update the data:
ractive.set( 'superheroes[1].power', 'Martial arts' );

// Or, you can use dot notation. Whichever you prefer:
ractive.set( 'superheroes.3.power', 'Enhanced senses' );

// UPDATING LIST
var newSuperhero = {
    name: 'Storm',
    realname: 'Monroe, Ororo',
    power: 'Controlling the weather',
    info: 'http://www.superherodb.com/Storm/10-135/'
};

// xmen[ xmen.length ] = newSuperhero;

// If you don't pass a keypath argument to ractive.update(), Ractive.js will update everything that has changed since the last set or update.
// ractive.update( 'superheroes' );

// OR mutator methods for arrays (push, pop, shift, unshift, splice, sort and reverse)
ractive.push( 'superheroes', newSuperhero );

// we want to do something with the data when it changes
ractive.observe( 'name', function ( newValue, oldValue ) {
    console.log('The name changed: ' + newValue);
});

  

/* var images = [
	{ src: '/img/gifs/problem.gif', caption: 'Trying to work out a problem after the 5th hour' },
	{ src: '/img/gifs/css.gif', caption: 'Trying to fix someone else\'s CSS' },
	{ src: '/img/gifs/ie.gif', caption: 'Testing interface on Internet Explorer' },
	{ src: '/img/gifs/w3c.gif', caption: 'Trying to code to W3C standards' },
	{ src: '/img/gifs/build.gif', caption: 'Visiting the guy who wrote the build scripts' },
	{ src: '/img/gifs/test.gif', caption: 'I don\'t need to test that. What can possibly go wrong?' }
];

var Slideshow = Ractive.extend({
	template: '#slideshow',
	goto: function ( index ) {
		var images = this.get( 'images' );
		
		// handle wrap around
		var num = ( index + images.length ) % images.length;
		
		this.set( 'current', num );
	},
	data: function () {
		return { current: 0 }
	}
});

var slideshow = new Slideshow({
	target: '#target',
	data: {
		images: images
	}
}) */

var View = Ractive.extend({
	template: '<h2>I am an extension view!!!</h2>'
});
var viewInstance = new View();

ractive.attachChild( viewInstance, { target: 'main' });



// ANIMATIOS

var xhr = new XMLHttpRequest();
xhr.addEventListener( 'load', function () {
	ractive.set({
		cities: JSON.parse( this.responseText ),
		selectedIndex: 0
	});
});
xhr.open( 'GET', '/tutorials/temperatures.json' );
xhr.send();


ractive.on( 'show', function ( ctx, which ) {
	this.set( 'visible', null ).then( function () {
		ractive.set( 'visible', which );
	});
});

