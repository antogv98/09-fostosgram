import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PostsService } from '../../services/posts.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions} from '@ionic-native/camera/ngx';


declare var window:any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  

  tempImages:string[]=[];
  cargandoGeo=false;
  post={
    mensaje:'',
    coords: null,
    posicion:false
  }

  constructor(private postsService:PostsService,private route:Router,private geolocation: Geolocation,private camera: Camera) {}

  async crearPost(){

   const creado = await this.postsService.crearPost(this.post);
    this.post={
      mensaje:'',
      coords: null,
      posicion:false
    };

    this.tempImages=[];
    
    this.route.navigateByUrl('/main/tabs/tab1');
  }

  getGeo(){
    console.log(this.post);
    if(!this.post.posicion){
      this.post.coords=null;
      this.cargandoGeo=false;
      return;
    }
      this.cargandoGeo=true;
      var options = { maximumAge: 3000, timeout: 30000, enableHighAccuracy: true };
      this.geolocation.getCurrentPosition(options).then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        const coords= `${resp.coords.latitude},${resp.coords.longitude}`
        this.post.coords=coords;
        

        console.log(coords);
        

        this.cargandoGeo=false;
       }).catch((error) => {
        this.cargandoGeo=false;
       });
    
  }

  camara(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,
      sourceType:this.camera.PictureSourceType.CAMERA
    }
    
    this.procesarImagen(options);
    
  }


  libreria(){

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY
    }
    
    this.procesarImagen(options);

  }


  procesarImagen(options:CameraOptions){
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     const img= window.Ionic.WebView.convertFileSrc(imageData);
    
     
      this.postsService.subirImagen(imageData);
     this.tempImages.push(img);
     
     
    }, (err) => {
     // Handle error
    });
  }

}
