
import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadUploadEvent, ItemTemplateOptions,} from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import './index.scss';
import { currentLanguageValue, translationService } from '../../services/translation.service';
import { LocalStore } from '../../utils/storage.utils';

export default function FileUploadComponent() {
  const toast = useRef<Toast>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef<FileUpload>(null);

  React.useMemo(() => currentLanguageValue.subscribe(setCurrentLanguage), [currentLanguage]);

  const onTemplateSelect = (e: any) => {
    let _totalSize = totalSize;
    let files = e.files;

    for (let i = 0; i < files.length; i++) {
      _totalSize += files[i].size || 0;
    }

    setTotalSize(_totalSize);
  };

  const onTemplateUpload = (e: FileUploadUploadEvent) => {
    console.log(e);
    let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    LocalStore.set("UPLOADED_FILES", JSON.parse(e.xhr.response));
  };

  const onTemplateRemove = (file: File, callback: Function) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    // const formattedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

    return (
      <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', }}>
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex items-center gap-3 ml-auto">
          <small>Max 1 MB</small>
          <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
        </div>
    </div>
  );
  };

  const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
    const file = inFile as File & {objectURL: string};
    return (
      <div className="flex items-center justify-between flex-wrap">
      <div className="flex items-center" style={{ width: '40%' }}>
        <img alt={file.name} role="presentation" src={file?.objectURL} width={100} />
        <small className="flex flex-col text-left ml-3">
          {file.name}
          <span>{new Date().toLocaleDateString()}</span>
        </small>
      </div>
        <div>
          <Tag value={props.formatSize} severity="warning" className="px-3 mb-3" /> &nbsp; &nbsp;
          <Button type="button" icon="pi pi-times" size='small' className="p-button-outlined p-button-rounded p-button-danger" onClick={() => onTemplateRemove(file, props.onRemove)} />
        </div>
    </div>
  );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex items-center flex-col">
        <i className="pi pi-image p-3" style={{ fontSize: '24px', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'rgba(0,0,0,0.37)' }}></i>
        <span style={{ fontSize: '16px', color: 'var(--text-color-secondary)' }} className="my-3">
          {translationService(currentLanguage,'TEXT.IMAGE_TEXT')}
        </span>
      </div>
  );
  };

  const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
  const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
  const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

  return (
    <div>
      <Toast ref={toast}></Toast>

      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      <FileUpload ref={fileUploadRef} name="files" url="http://localhost:3001/company/upload" multiple accept="image/*" maxFileSize={1000000}
      onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
      headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
      chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
  </div>
)
}
