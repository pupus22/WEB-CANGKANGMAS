import {DRIVE_CLIENT_ID} from './drive-config.js';
// OAuth client id publik tidak rahasia; access token hanya ada di memori browser.
let tokenClient=null,token='',expiry=0;
export const driveReady=()=>/^[0-9]+-[a-z0-9_-]+\.apps\.googleusercontent\.com$/i.test(DRIVE_CLIENT_ID);
function getToken(){
 if(!driveReady())throw Error('Google OAuth Client ID belum diisi pada manajemen/drive-config.js.');
 if(token&&Date.now()<expiry-60000)return Promise.resolve(token);
 if(!window.google?.accounts?.oauth2)throw Error('Google Identity Services tidak termuat. Periksa koneksi internet.');
 return new Promise((resolve,reject)=>{
  if(!tokenClient)tokenClient=google.accounts.oauth2.initTokenClient({client_id:DRIVE_CLIENT_ID,scope:'https://www.googleapis.com/auth/drive.file',callback:()=>{}});
  tokenClient.callback=r=>{if(r.error||!r.access_token){reject(Error('Izin Google Drive ditolak atau gagal.'));return}token=r.access_token;expiry=Date.now()+(Number(r.expires_in)||3000)*1000;resolve(token)};
  tokenClient.requestAccessToken({prompt:token?'':'consent'});
 });
}
async function api(url,options={}){
 let res=await fetch(url,{...options,headers:{Authorization:'Bearer '+await getToken(),...(options.headers||{})}});
 if(!res.ok){let detail='';try{const j=await res.json();detail=j.error?.message||''}catch{};throw Error('Google Drive: '+(detail||'HTTP '+res.status))}
 return res.status===204?null:res.json();
}
export async function uploadDrivePhoto(blob,originalName){
 if(!(blob instanceof Blob)||blob.type!=='image/webp')throw Error('Hanya gambar WebP hasil kompresi yang dapat diunggah.');
 const filename='cangkangmas-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.webp';
 const boundary='cm_'+Math.random().toString(36).slice(2);
 const metadata=JSON.stringify({name:filename,mimeType:'image/webp',description:'Foto publik Cangkang Mas, sumber '+String(originalName||'').slice(0,80)});
 const payload=new Blob(['--'+boundary+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+metadata+'\r\n--'+boundary+'\r\nContent-Type: image/webp\r\n\r\n',blob,'\r\n--'+boundary+'--'],{type:'multipart/related; boundary='+boundary});
 const created=await api('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType',{method:'POST',headers:{'Content-Type':'multipart/related; boundary='+boundary},body:payload});
 if(!/^[A-Za-z0-9_-]{10,}$/.test(created?.id||''))throw Error('Google Drive tidak mengembalikan ID foto yang valid.');
 try{await api('https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(created.id)+'/permissions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'anyone',role:'reader'})})}
 catch(e){throw Error('Foto di Drive berhasil diunggah, tetapi izin berbagi publik gagal. File tetap ada di Drive; cek pengaturan berbagi. '+e.message)}
 return {id:created.id,url:'https://drive.google.com/thumbnail?id='+created.id+'&sz=w1600'};
}
