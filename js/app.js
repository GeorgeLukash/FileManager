angular.module('App', ['LocalStorageModule'])
 .controller('appCtrl', appCtrl);
appCtrl.$inject = ['localStorageService'];
function appCtrl(localStorageService) {
    var vm = this;
    vm.showHide = true;
    vm.navigationStack = [{ name: 'rootFolder' }];
    vm.disable = true;
    vm.rootFolder = {
        name: 'rootFolder',
        copies: 1,
        files: [
            { name: 'File2', extension: '.txt',copies: 1 },
            { name: 'File3', extension: '.txt',copies: 1 },
            { name: 'File1', extension: '.txt',copies: 1 },
            { name: 'File4', extension: '.txt',copies: 1 }
        ],
        folders: [
            {
                name: 'folder1',
                copies: 1,
                files: [{ name: 'File1', extension: '.txt', copies: 1 }],
                folders: [{
                    name: 'folder',
                    copies: 1,
                    files: [{ name: 'File', extension: '.txt', copies: 1 }],
                    folders: []
                }]
            },
            {
                name: 'folder2',
                copies: 1,
                files: [{ name: 'File2', extension: '.txt', copies: 1 }],
                folders: []
            },
            {
                name: 'folder3',
                copies: 1,
                files: [{ name: 'File3', extension: '.txt', copies: 1 }],
                folders: []
            }
        ]
    };
    vm.currentFolder = vm.rootFolder;
    vm.NavigatTo = function (folder) {
        vm.currentFolder = folder;
        vm.navigationStack[vm.navigationStack.length] = { name: vm.currentFolder.name };
        vm.disable = false;
    };
    vm.NavigatByName = function (folderIndex, folderName) {
        var folderTmp = vm.rootFolder;
        for (var i = 0; i < folderIndex; i++) {
            for (var j = 0; j < folderTmp.folders.length; j++) {
                if (folderTmp.folders[j].name == vm.navigationStack[i + 1].name) {
                    folderTmp = folderTmp.folders[j];
                    break;
                }
            }
        }
        vm.currentFolder = folderTmp;
        vm.navigationStack.length = folderIndex + 1;
    };
    vm.GoBack = function (curFolder) {
        var folderTmp = vm.rootFolder;
        if (vm.navigationStack.length == 1) {
            vm.disable = true;
        } else {
            vm.navigationStack.pop(curFolder.name);
            for (var i = 0; i < vm.navigationStack.length; i++) {
                for (var j = 0; j < folderTmp.folders.length; j++) {
                    if (folderTmp.folders[j].name == vm.navigationStack[i].name) {
                        folderTmp = folderTmp.folders[j];
                        break;
                    }
                }
            }
            vm.currentFolder = folderTmp;
            vm.disable = false;
        }
    }
    vm.Synchronization = function () {
        localStorageService.set('foldersdata', vm.rootFolder);
    };
    vm.AddNewFolder = function () {
        var nameFolder = prompt('Enter folder name', 'NewFolder');
        if (nameFolder != null) {
            for (var i = 0; i < vm.currentFolder.folders.length; i++) {
                if (nameFolder == vm.currentFolder.folders[i].name) {
                    nameFolder = vm.currentFolder.folders[i].name + '(' + vm.currentFolder.folders[i].copies + ')';
                    vm.currentFolder.folders[i].copies++;
                }
            }
            var newFolder = { name: nameFolder, copies: 1, files: [], folders: [] };
            vm.currentFolder.folders.push(newFolder);
            vm.Synchronization();
        }
    };
    vm.AddNewFile = function () {
        var nameFile = prompt('Enter file name', 'NewFile');
        var fileExtension = prompt('Enter file extension', '.txt');
        if (nameFile != null && fileExtension != null) {
            for (var i = 0; i < vm.currentFolder.files.length; i++) {
                if (nameFile == vm.currentFolder.files[i].name) {
                    nameFile = vm.currentFolder.files[i].name + '(' + vm.currentFolder.files[i].copies + ')';
                    vm.currentFolder.files[i].copies++;
                }
            }

            var newFile = { name: nameFile, extension: fileExtension, copies: 1 }
            vm.currentFolder.files.push(newFile);
            vm.Synchronization();
        }
    };
    vm.RenameFolder = function (curFolder) {
        var newName = prompt('Enter new name : ', curFolder.name);
        if (newName != null) {
            curFolder.name = newName;
            vm.Synchronization();
        }
    }
    vm.RenameFile = function (curFile) {
        var newName = prompt('Enter new name : ', curFile.name);
        if (newName != null) {
            curFile.name = newName;
            vm.Synchronization();
        }
    };
    vm.DeleteFolder = function (curFolderIndex) {
        if (confirm('Are you sure?')) {
            vm.currentFolder.folders.splice(curFolderIndex, 1);
            vm.Synchronization();
        }
    };
    vm.DeleteFile = function (curFileIndex) {
        if (confirm('Are you sure?')) {
            vm.currentFolder.files.splice(curFileIndex, 1);
            vm.Synchronization();
        }
    };
    vm.ChangeState = function () {
        vm.showHide = !vm.showHide;
    }
    function Init() {
        var x = localStorageService.get('foldersdata');
        if (x != null) {
            vm.rootFolder = x;
            vm.currentFolder = vm.rootFolder;
        }
    };
    Init();
};