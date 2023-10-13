import {Component, OnInit, TemplateRef} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = '';
  description: string = '';
  url : string = '';
 // http://127.0.0.1:5500/
 //http://3.216.132.240:5000/
  apiurl : string = 'https://demo.scraping-api.minoanexperience.com';
  images: string[] = [];
  loader: boolean = false;
  selectedImageIndex = 0;


  constructor(
    public modalService: NgbModal,
    private http: HttpClient
  ) {
  }

  urlForm: FormGroup = new FormGroup({
    url: new FormControl('', [Validators.required])
  });

  openModal(modal : TemplateRef<any>){
    this.modalService.open(modal, {centered: true, size: 'lg'});
  }

  closeModal(){
    this.modalService.dismissAll();
    this.urlForm.reset();
  }

  backModal(modal : TemplateRef<any>){
    this.modalService.dismissAll();
    this.openModal(modal);
  }

  submitUrlForm(modalRef: TemplateRef<any>){
    // Define the request body
   if(this.urlForm.invalid){
      return;
    }
    this.modalService.dismissAll();
    this.loader = true;
    this.openModal(modalRef);

    const formData = this.urlForm.getRawValue();

    this.url = formData.url;
    // this.urlForm.reset();

    const requestBody = {
      "urls": [
        {
         "url": this.url,
          // "url": "https://brooklynbedding-hospitality.minoanexperience.com/single-space/product-detail?productId=63c9b0380414ef001270de5e",
          "id": 123
        }
      ]
    };

// Send the HTTP POST request with the request body
    this.http.post(this.apiurl, requestBody).subscribe(
      (response) => {
        console.log(response);
        this.setData(response);
      },
      (error) => {
        // Handle any errors here
        console.error(error);
      }
    );


  }

  // setData(res: any) {
  //   console.log(res);
  //   const data = res;
  //   this.title = data[0].response.title;
  //   this.images = data[0].response.images
  //     ? data[0].response.images.filter((image: string) => {
  //         const extension = image.toLowerCase();
  //         return extension.endsWith('.jpg') || extension.endsWith('.png') || extension.endsWith('.jpeg') || extension.endsWith('.webp');
  //       })
  //     : [];
  //   this.description = data[0].response.description;
  
  //   if (this.description.length === 0) {
  //     this.description = this.title;
  //   }
  
  //   this.loader = false;
  // }
  
  setData(res: any){
    console.log(res)
    const data = res
    this.title = data[0].response.title;
    this.images = data[0].response.images ? data[0].response.images : [];
    this.description = data[0].response.description;
    if(this.description.length == 0){
      this.description =  this.title
    }

    this.loader = false;
  }
  

  imageClick(index: number){
    this.selectedImageIndex = index;
  }

  ngOnInit(): void {
  }
}
