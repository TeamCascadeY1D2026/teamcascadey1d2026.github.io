const dropZone = document.getElementById("dropZone");
      const fileInput = document.getElementById("fileInput");
      const filePreview = document.getElementById("filePreview");
      const fileName = document.getElementById("fileName");
      const fileSize = document.getElementById("fileSize");
      const fileIcon = document.getElementById("fileIcon");
      const fileRemove = document.getElementById("fileRemove");
      const uploadBtn = document.getElementById("uploadBtn");
      const progressBar = document.getElementById("progressBar");
      const progressFill = document.getElementById("progressFill");
      const status = document.getElementById("status");
      const result = document.getElementById("result");
      const resultUrl = document.getElementById("resultUrl");
      const copyBtn = document.getElementById("copyBtn");
      const visitLink = document.getElementById("visitLink");
      const error = document.getElementById("error");

      let selectedFile = null;

      // File type icons
      function getIcon(type) {
        if (type.startsWith("image/")) return "🖼️";
        if (type.startsWith("video/")) return "🎬";
        if (type.startsWith("audio/")) return "🎵";
        if (type.includes("pdf")) return "📕";
        if (
          type.includes("zip") ||
          type.includes("rar") ||
          type.includes("tar")
        )
          return "📦";
        if (
          type.includes("text") ||
          type.includes("json") ||
          type.includes("xml")
        )
          return "📝";
        return "📄";
      }

      function formatSize(bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1048576).toFixed(1) + " MB";
      }

      function setFile(file) {
        selectedFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = formatSize(file.size);
        fileIcon.textContent = getIcon(file.type);
        filePreview.classList.add("show-flex");
        uploadBtn.classList.add("show");
        result.classList.remove("show");
        error.classList.remove("show");
      }

      function clearFile() {
        selectedFile = null;
        fileInput.value = "";
        filePreview.classList.remove("show-flex");
        uploadBtn.classList.remove("show");
        result.classList.remove("show");
        error.classList.remove("show");
        status.classList.remove("show");
        progressBar.classList.remove("show");
      }

      // Drop zone events
      dropZone.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", () => {
        if (fileInput.files[0]) setFile(fileInput.files[0]);
      });
      fileRemove.addEventListener("click", (e) => {
        e.stopPropagation();
        clearFile();
      });

      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
      });
      dropZone.addEventListener("dragleave", () =>
        dropZone.classList.remove("dragover"),
      );
      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
      });

      // Upload logic
      uploadBtn.addEventListener("click", async () => {
        if (!selectedFile) return;

        uploadBtn.disabled = true;
        error.classList.remove("show");
        result.classList.remove("show");
        progressBar.classList.add("show");
        status.classList.add("show");

        try {
          // Step 1: Get or create the hosted subdomain
          status.textContent = "Preparing site...";
          progressFill.style.width = "15%";

          let subdomain = await puter.kv.get("site_subdomain");

          if (!subdomain) {
            subdomain = "file-" + crypto.randomUUID().split("-")[0];
            await puter.hosting.create(subdomain, ".");
            await puter.kv.set("site_subdomain", subdomain);
          }

          // Step 2: Write the file with a unique name
          status.textContent = "Uploading file...";
          progressFill.style.width = "40%";
          const ext = selectedFile.name.includes(".")
            ? "." + selectedFile.name.split(".").pop()
            : "";
          const uniqueName = crypto.randomUUID().split("-")[0] + ext;
          await puter.fs.write(`${uniqueName}`, selectedFile);

          // Step 3: Generate public link
          status.textContent = "Generating public link...";
          progressFill.style.width = "75%";

          const encodedName = encodeURIComponent(uniqueName);

          // Done!
          progressFill.style.width = "100%";
          const directUrl = `https://${subdomain}.puter.site/${encodedName}`;
          resultUrl.textContent = directUrl;
          visitLink.href = directUrl;
          result.classList.add("show");

          addComment(directUrl);
          status.textContent = "Done!";

    

          setTimeout(() => {
            progressBar.classList.remove("show");
            status.classList.remove("show");
          }, 1000);
        } catch (err) {
          error.textContent = "Error: " + (err.message || err);
          error.classList.add("show");
          progressBar.classList.remove("show");
          status.classList.remove("show");
        }

        uploadBtn.disabled = false;
      });

      // Copy button
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(resultUrl.textContent).then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
        });
    });

      // from https://github.com/RajdeepSSaini/Comment_Box/blob/main/script.js

      function addComment(directUrl) {
        // add link to list
        var link = document.getElementById("commentInput").value.trim();
        if (link === "") {
        alert("Link was not generated.");
        return;
    }

    var linkList = document.getElementById("linkList");
    var listItem = document.createElement("li");
    var commentText = document.createTextNode(link);
    listItem.appendChild(linkText);
    linkList.appendChild(listItem);

    // Clear input fields
 
    document.getElementById("commentInput").value = "";
};