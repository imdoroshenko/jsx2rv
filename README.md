jsx2rv
======

JSX to RV compiler. 

This is tool for my small handmade framework RV (Rich View). It's compile JSX code to RV notation. 

#Example
##gulpfile.js
```js
var rsx2rv = require('jsx2rv');

gulp.task('jsx2rv', function(cb) {
    gulp.src('profile.js')
        .pipe(rsx2rv())
        .pipe(gulp.dest('compiled/profile.js'));
});

gulp.task('default', ['jsx2rv']);
```

#profile.js source
```js
var UserProfileView = function (props) {
    RV.extend(this, RV.View);

    var CustomComponent = function(params) {
        var h3 = <RV><h3>{'Hello, ' + params.title}</h3></RV>;
        return h3;
    };
    
    this.setDataFromModel = function () {
        if ( model ) {
            this.refs.fname.value = model.get('fname');
            this.refs.lname.value = model.get('lname');
            this.refs.position.value = model.get('position');
            this.refs.img.setSRC(model.get('avatar'));
        }
    };
    
    this.onRenderAfter = function () {
        this.setDataFromModel();
    };

    this._render = function () {

        var heading = <RV><div class="panel-heading">Edit Profile</div></RV>;

        return <RV>
            <div ref="item" class="panel panel-primary" style="width: 600px; float: left; margin-left: 50px;">
                {heading}
                <CustomComponent title="this is text from test custom component!" />
                <div class="panel-body">
                    <div style="float: left;">
                        <div class="input-group">
                            <label for="fname" class="input-group-addon" style="width: 100px;">First Name:</label>
                            <input ref="fname" type="text" class="form-control" name="fname" id="fname" value=""/>
                        </div>
                        <div class="input-group">
                           <label for="lname" class="input-group-addon" style="width: 100px;">Last Name:</label>
                           <input ref="lname" type="text" class="form-control" name="lname" id="lname" value=""/>
                       </div>
                       <div class="input-group">
                           <label for="position" class="input-group-addon" style="width: 100px;">Position:</label>
                           <input ref="position" type="text" class="form-control" name="position" id="position" value=""/>
                       </div>
                   </div>
                   <div style="float: right;">
                       <ImageView ref="img" width="200px" height="200px"/>
                    </div>
               </div>
            </div>
        </RV>;
    };
};
```

#compiled/profile.js source
```js
var UserProfileView = function (props) {
    RV.extend(this, RV.View);

    var CustomComponent = function(params) {
        var h3 = RV.Node('h3', 'Hello, ' + params.title);
        return h3;
    };

    this.setDataFromModel = function () {
        if ( model ) {
            this.refs.fname.value = model.get('fname');
            this.refs.lname.value = model.get('lname');
            this.refs.position.value = model.get('position');
            this.refs.img.setSRC(model.get('avatar'));
        }
    };
    
    this.onRenderAfter = function () {
        this.setDataFromModel();
    };

    this._render = function () {

        var heading = RV.Node('div', {class: 'panel-heading'}, 'Edit Profile');

        return this.refs.item = RV.Node('div', {class: 'panel panel-primary',style: 'width: 600px; float: left; margin-left: 50px;'},                 heading                , 
        	new CustomComponent({title: 'this is text from test custom component!'}), 
        	RV.Node('div', {class: 'panel-body'}, 
        		RV.Node('div', {style: 'float: left;'}, 
        			RV.Node('div', {class: 'input-group'}, 
        				RV.Node('label', {for: 'fname',class: 'input-group-addon',style: 'width: 100px;'}, 'First Name:'), 
        				this.refs.fname = RV.Node('input', {type: 'text',class: 'form-control',name: 'fname',id: 'fname',value: ''})), 
        			RV.Node('div', {class: 'input-group'}, 
        				RV.Node('label', {for: 'lname',class: 'input-group-addon',style: 'width: 100px;'}, 'Last Name:'), 
        				this.refs.lname = RV.Node('input', {type: 'text',class: 'form-control',name: 'lname',id: 'lname',value: ''})), 
        			RV.Node('div', {class: 'input-group'}, 
        				RV.Node('label', {for: 'position',class: 'input-group-addon',style: 'width: 100px;'}, 'Position:'), 
        				this.refs.position = RV.Node('input', {type: 'text',class: 'form-control',name: 'position',id: 'position',value: ''}))), 
        		RV.Node('div', {style: 'float: right;'}, 
        			this.refs.img = new ImageView({width: '200px',height: '200px'}))));
    };
};
```
