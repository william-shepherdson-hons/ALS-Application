use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;

pub fn signin(app_data_dir: String) -> std::io::Result<()> {
    let mut path = PathBuf::from(&app_data_dir);

    fs::create_dir_all(&path)?;

    path.push("launch");

    let mut file = File::create(path)?;
    file.write_all(b"sign")?;

    Ok(())
}
