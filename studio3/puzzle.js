var Puzzle={
        'BORDER_WIDTH':5,
        'BORDER_COLOR':'#000',
        'SPEED':200,

        make:function(how_many) {
                // if (!$('puzzle')||!$E('img','puzzle')) {
                //         alert("Sorry no DIV with id #puzzle, OR it does not have an img tag.");
                //         return false;
                // }
                // if (Puzzle.initialized) {
                //         alert('Puzzle ALREADY initialized.');
                //         return false;
                // }

                how_many=parseInt(how_many);
                Puzzle.how_many=parseInt(how_many);
                Puzzle.empty_x=Puzzle.how_many-1;
                Puzzle.empty_y=Puzzle.how_many-1;

                var puzzle_image=$E('img','puzzle');
                $('puzzle').setStyles( {
                        width: (puzzle_image.width)+'px',
                        height: (puzzle_image.height)+'px',
                        overflow:'hidden'
                }); 

                Puzzle.solution='';
                Puzzle.counter=0;
                var p_num=0;
                Puzzle.piece_arr=new Array();

                //Puzzle Creation Stuff
                for(var x=0;x<how_many;x++) {
                        for(var y=0;y<how_many;y++) {
                                if (!((y==(how_many-1))&&(x==(how_many-1)))) {
                                        Puzzle.solution+=''+x+y;
                                        var b_x=(Puzzle.width+Puzzle.BORDER_WIDTH)*y*-1;
                                        var b_y=(Puzzle.height+Puzzle.BORDER_WIDTH)*x*-1;

                                var puzzle_piece=new Element('div');
                                puzzle_piece.setStyles( {
                                        border:Puzzle.BORDER_WIDTH+'px solid '+Puzzle.BORDER_COLOR,
                                        'background-image':'url('+puzzle_image.src+')',
                                        'background-position':b_x+'px '+b_y+'px',
                                        'overflow':'hidden',
                                        'position':'absolute',
                                        'width':Puzzle.width+'px',
                                        'margin-left':(b_x*-1)+'px',
                                        'margin-top':(b_y*-1)+'px',
                                        'height':Puzzle.height+'px'
                                });

                                var puzzle_href=new Element('a');
                                puzzle_href.appendText('');
                                puzzle_href.setStyles( {
                                        'display':'block',
                                        'width':Puzzle.width+'px',
                                        'height':Puzzle.height+'px'
                                });

                                puzzle_href.setProperty('href','#');
                                puzzle_href.onclick=function() {
                                        Puzzle.move(this);
                                        return false
                                };
                                        puzzle_href.injectInside(puzzle_piece);
                                        puzzle_piece.setProperty('p_num',p_num);
                                        puzzle_piece.setProperty('p_x',x);
                                        puzzle_piece.setProperty('p_y',y);
                                        puzzle_piece.injectAfter($('puzzle').getLast());
                                }

                                Puzzle.piece_arr.push(p_num);
                                p_num++
                        }
                }
                Puzzle.initialized=true;
                puzzle_image.remove();
                return false;
        },

        //Shuffe Function
        shuffle:function() {
                if(!Puzzle.initialized) {
                        alert('Puzzle not initialized');
                        return false;
                }
                Puzzle.counter=0;
                this.auto_move(true);
                return false;
        },
        //Fix Function
        fix:function() {
                if(!Puzzle.initialized) {
                        alert('Puzzle not initialized');
                        return false;
                }
                Puzzle.counter=0;
                this.auto_move(false);
                return false;
        },

        //Switch Image Function
        switch_image:function(imageSrc) {
                this.preload=new Image();
                if(Puzzle.initialized){
                        this.preload.onload=this.do_switch_puzzle_image.bind(this)
                }
                else {
                        this.preload.onload=this.do_switch_image.bind(this)
                }
                this.preload.src=imageSrc;
                return false;
        },

        //Check Function
        check:function() {
                var div_string='';
                $$('#puzzle div').each(function(el) {
                        div_string+=''+el.getProperty('p_x')+el.getProperty('p_y')
                });
                if (div_string==Puzzle.solution) {
                        alert('Solved in '+Puzzle.counter+' tries.')
                }
        },

        'how_many':4,
        'counter':0,
        'empty_x':3,
        'empty_y':3,
        'width':3,
        'height':3,
        'solution':'',
        'initialized':false,
        'piece_arr':new Array(),

        //Move Logic
        move:function(this_piece_a) {
                var this_piece=this_piece_a.getParent();
                var piece_x=this_piece.getProperty('p_x').toInt();
                var piece_y=this_piece.getProperty('p_y').toInt();
                var valid_piece=false;
                var is_row=false;
                var is_col=false;
                if ((piece_x==Puzzle.empty_x)&&((piece_y==(Puzzle.empty_y-1))||(piece_y==(Puzzle.empty_y+1)))) {
                        valid_piece=true;
                        is_row=true;
                }
                else if ((piece_y==Puzzle.empty_y)&&((piece_x==(Puzzle.empty_x-1))||(piece_x==(Puzzle.empty_x+1)))) {
                        valid_piece=true;
                        is_col=true;
                }
                if (valid_piece) {
                        Puzzle.counter++;
                        var previous_margin=(is_row)?this_piece.getStyle('margin-left').toInt():this_piece.getStyle('margin-top').toInt();

                        var new_margin=(is_row)?(Puzzle.width+Puzzle.BORDER_WIDTH)*Puzzle.empty_y:(Puzzle.height+Puzzle.BORDER_WIDTH)*Puzzle.empty_x;

                        var s_margin=(is_row)?new Fx.Style(this_piece,'margin-left',{duration:Puzzle.SPEED}):new Fx.Style(this_piece,'margin-top',{duration:Puzzle.SPEED});s_margin.start(previous_margin,new_margin);

                        if (is_row) {
                                this_piece.setProperty('p_y',Puzzle.empty_y)
                        }
                        else { 
                                this_piece.setProperty('p_x',Puzzle.empty_x)
                        }
                        Puzzle.empty_x=piece_x;
                        Puzzle.empty_y=piece_y;
                        this.check();
                }
        },

        //Auto Move Logic
        auto_move:function(do_shuffle) {
                var tmp=Puzzle.piece_arr.copy();

                if(do_shuffle) {
                        tmp.shuffle();
                }
                var pause_factor=0;
                var index_pos=0;
                                
                $$('#puzzle div').each(function(el) {
                        var p_num=tmp[index_pos];
                        var x=Math.floor(p_num/Puzzle.how_many);
                        var y=Math.floor(p_num%Puzzle.how_many);
                        var b_x=(Puzzle.width+Puzzle.BORDER_WIDTH)*y;
                        var b_y=(Puzzle.height+Puzzle.BORDER_WIDTH)*x;

                        var l_margin=el.getStyle('margin-left').toInt();
                        var t_margin=el.getStyle('margin-top').toInt();
                        if((b_x!=l_margin)||(b_y!=t_margin)) {
                                var s_l_margin=new Fx.Style(el,'margin-left', {
                                        duration:Puzzle.SPEED
                                });
                                var s_t_margin=new Fx.Style(el,'margin-top', {
                                        duration:Puzzle.SPEED
                                });
                                el.setProperty('p_x',x);
                                el.setProperty('p_y',y);
                                s_l_margin.start.pass([l_margin,b_x],
                                s_l_margin).delay(100*pause_factor);
                                s_t_margin.start.pass([t_margin,b_y],
                                s_t_margin).delay(100*pause_factor);
                                pause_factor++
                        }
                        index_pos++
                });
                var p_num=tmp[index_pos];
                Puzzle.empty_x=Math.floor(p_num/Puzzle.how_many);
                Puzzle.empty_y=Math.floor(p_num%Puzzle.how_many);
                return false
        },

        //Switch Image Logic
        do_switch_image:function() {
                if(!$('puzzle')&&!$E('img','puzzle')) {
                        alert("Sorry no DIV with id #puzzle, OR it does not have an img tag.");
                        return false;
                }
                var puzzle_image=$E('img','puzzle');
                puzzle_image.src=this.preload.src;
                puzzle_image.setProperty('height',this.preload.src.height);
                puzzle_image.setProperty('width',this.preload.src.width);
                return false;
        },

        //Switch Puzzle Image Logic
        do_switch_puzzle_image:function() {
                var new_src=this.preload.src;
                $('puzzle').setStyles( {
                        width:this.preload.width+'px',
                        height:this.preload.height+'px'
                });
                Puzzle.width=Math.round((this.preload.width-(Puzzle.how_many*Puzzle.BORDER_WIDTH))/Puzzle.how_many);
                Puzzle.height=Math.round((this.preload.height-(Puzzle.how_many*Puzzle.BORDER_WIDTH))/Puzzle.how_many);
                var p=0;
                $$('#puzzle div').each(function(el) {
                        var x=Math.floor(p/Puzzle.how_many);
                        var y=Math.floor(p%Puzzle.how_many);
                        var b_x=(Puzzle.width+Puzzle.BORDER_WIDTH)*y*-1;
                        var b_y=(Puzzle.height+Puzzle.BORDER_WIDTH)*x*-1;
                        el.setStyles( {
                                'background-image':'url('+new_src+')','width':Puzzle.width+'px','height':Puzzle.height+'px','background-position':b_x+'px '+b_y+'px'
                        });
                        p++
                });
                this.fix();
        }
};

/** prototype **/
Array.prototype.shuffle = function (){
        for(var rnd, tmp, i=this.length; i; rnd=parseInt(Math.random()*i), tmp=this[--i], this[i]=this[rnd], this[rnd]=tmp);
};
