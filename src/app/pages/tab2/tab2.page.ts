import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../../interfaces/interfaces';
import { PostsService } from '../../services/posts.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
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

  constructor(private postsService:PostsService,private route:Router,private geolocation: Geolocation) {}

  async crearPost(){

   const creado = await this.postsService.crearPost(this.post);
    this.post={
      mensaje:'',
      coords: null,
      posicion:false
    };
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

      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        const coords= `${resp.coords.latitude},${resp.coords.longitude}`
        this.post.coords=coords;
        


        this.cargandoGeo=false;
       }).catch((error) => {
        this.cargandoGeo=false;
       });
    
  }

}
