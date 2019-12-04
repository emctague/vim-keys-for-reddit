//
//  SafariExtensionHandler.swift
//  Vim Keys for Reddit Extension
//
//  Created by Ethan McTague on 2019-12-04.
//  Copyright © 2019 Ethan McTague. All rights reserved.
//

import SafariServices

class SafariExtensionHandler: SFSafariExtensionHandler {
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        
        if (messageName == "openNewTab") {
            SFSafariApplication.getActiveWindow { (window) in
                window?.openTab(with: URL(string: userInfo?["url"]! as! String)!, makeActiveIfPossible: true, completionHandler: {_ in });
            }
        }
        
    }
    
    override func toolbarItemClicked(in window: SFSafariWindow) {
        // This method will be called when your toolbar item is clicked.
        NSLog("The extension's toolbar item was clicked")
    }
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        // This is called when Safari's state changed in some way that would require the extension's toolbar item to be validated again.
        validationHandler(true, "")
    }
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }

}
