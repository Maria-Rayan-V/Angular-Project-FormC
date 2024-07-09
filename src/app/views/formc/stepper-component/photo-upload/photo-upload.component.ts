import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { snackbarDuration } from 'src/app/shared/FormCConstants/formcUrlCons';
import { FormcServicesService } from 'src/app/shared/services/formc-services.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss'],
})
export class PhotoUploadComponent implements OnInit {
  @Output() sendRandomNotoParent: EventEmitter<any> = new EventEmitter();
  @Input() isFromPendingAppl: boolean;
  imageSize: any;
  imageType: any;
  @Input() stepperNxtFunction: (args: any) => void;
  @ViewChild('myStepper') private myStepper: MatStepper;
  base64ImgString: any;
  checkCropped: any;
  photoUploadForm: any;
  imageChangedEvent: any = '';
  stream: any = null;
  imageUrlToCropper: any;
  croppedImage: any = '';
  status: any = null;
  loading: boolean = false;
  trigger: Subject<void> = new Subject();
  previewImage: string = '';
  btnLabel: string = 'Capture';
  fileToUpload: any;
  imageUrl: any;
  get $trigger(): Observable<void> {
    return this.trigger.asObservable();
  }
  constructor(
    private ls: LocalStoreService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private formcService: FormcServicesService
  ) {}
  ngOnInit() {
    console.log('In child init pending', this.isFromPendingAppl);
    if (this.isFromPendingAppl) {
      var existingImage = this.ls.getItem('img');
      this.croppedImage = 'data:image/jpeg;base64,' + existingImage;
    }

    this.ls.setItem('img', null);
    console.log('existing image', this.croppedImage.length);
  }
  snapshot(event: WebcamImage) {
    console.log(event);
    this.imageUrlToCropper = event.imageAsDataUrl;
    console.log('Image Change event', this.imageUrlToCropper);
    // this.previewImage = event.imageAsDataUrl;
    this.btnLabel = 'Re capture';
  }
  fileChangeEvent(event: any): void {
    this.croppedImage = null;

    this.imageChangedEvent = event;
    console.log('Image Change event', this.imageChangedEvent);
  }
  checkPermissions() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 200,
          height: 200,
        },
      })
      .then((res) => {
        console.log('response', res);
        this.stream = res;
        this.status = '';
        this.btnLabel = 'Capture ';
      })
      .catch((err) => {
        console.log(err);
        if (err?.message === 'Permission denied') {
          this.status =
            'Permission denied please try again by approving the access';
        } else {
          this.status =
            'You may not having camera system, Please try again ...';
        }
      });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log('selected image', this.croppedImage);
    let myImageFile = base64ToFile(this.croppedImage);
    var myImageFileName = myImageFile.type;
    var ext = myImageFileName.split('/').pop();
    this.imageType = ext;
    this.imageSize = myImageFile.size / 1000;
    console.log('My file image', myImageFile);
    console.log('Cropped img size', myImageFile.size / 1000);
    console.log('Cropped img extn', ext);
  }
  imageLoaded() {
    /* show cropper */
  }
  cropperReady() {
    /* cropper ready */
  }
  loadImageFailed() {
    /* show message */
  }

  captureImage() {
    this.trigger.next();
  }

  // proceed() {
  //   console.log(this.previewImage);
  //   var strImage = this.previewImage.replace(/^data:image\/[a-z]+;base64,/, "");
  //   this.base64ImgString=strImage;
  //   console.log('strimage'+this.base64ImgString);
  // }
  uploadPhoto() {
    this.loading = true;
    console.log(this.croppedImage);
    var strImage = this.croppedImage.replace(/^data:image\/[a-z]+;base64,/, '');
    this.base64ImgString = strImage;
    console.log('strimage' + this.base64ImgString);
    if (this.croppedImage.length > 24) {
      if (!this.isFromPendingAppl) {
        if (
          this.imageType == 'jpeg' &&
          this.imageSize > 5 &&
          this.imageSize < 50
        ) {
          this.formcService.photoUpload(this.base64ImgString).subscribe(
            (data: any) => {
              //   this.openDialog(this.ls.getItem('formCApplid'));

              this.sendRandomNotoParent.emit(
                Math.floor(Math.random() * 100 + 1)
              );
              this.loading = false;
              this.stepperNxtFunction(this.myStepper);
              this.snackbar.open('Photo uploaded successfully', 'X', {
                duration: snackbarDuration,
                verticalPosition: 'top',
                panelClass: ['blue-snackbar'],
              });
            },
            (err) => {
              this.loading = false;
              console.log('Failure in photo upload', err);
              this.snackbar.open('Something went wrong', 'X', {
                duration: snackbarDuration,
              });
              //  alert(
              //    err
              //  )
            }
          );
        } else {
          this.loading = false;
          this.snackbar.open(
            'Allowed extension jpeg, File size should be greater than 5kb and less than 50kb',
            'X',
            {
              duration: snackbarDuration,
            }
          );
        }
      } else {
        this.formcService.photoUpload(this.base64ImgString).subscribe(
          (data: any) => {
            //   this.openDialog(this.ls.getItem('formCApplid'));

            this.sendRandomNotoParent.emit(Math.floor(Math.random() * 100 + 1));
            this.loading = false;
            this.stepperNxtFunction(this.myStepper);
            this.snackbar.open('Photo uploaded successfully', 'X', {
              duration: snackbarDuration,
              verticalPosition: 'top',
              panelClass: ['blue-snackbar'],
            });
          },
          (err) => {
            this.loading = false;
            console.log('Failure in photo upload', err);
            this.snackbar.open('Something went wrong', 'X', {
              duration: snackbarDuration,
            });
            //  alert(
            //    err
            //  )
          }
        );
      }
    } else {
      this.loading = false;
      this.snackbar.open('Please Select photo', 'X', {
        duration: snackbarDuration,
      });
    }
  }
}
