export class FileInfoModel {
    fileName: string; //transform(originalName)
    path: string; // dir-fileName,
    url: string; // https://
    mimetype: string;
    size: number;
    originalName: string //ten file khi client upload
}