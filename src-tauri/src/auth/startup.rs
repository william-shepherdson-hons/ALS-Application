use std::fs::File;
use std::io::{self, Read};
use std::path::PathBuf;

pub async fn check_sign_in_status(app_data_dir: String) -> io::Result<bool> {
    let mut path = PathBuf::from(app_data_dir);
    path.push("launch");

    let mut file = match File::open(&path) {
        Ok(file) => file,
        Err(e) if e.kind() == io::ErrorKind::NotFound => {
            return Ok(false); 
        }
        Err(e) => return Err(e),
    };

    let mut data = String::new();
    file.read_to_string(&mut data)?;

    Ok(data.trim() == "sign")
}
