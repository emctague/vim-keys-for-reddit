//
//  SafariExtensionViewController.swift
//  Vim Keys for Reddit Extension
//
//  Created by Ethan McTague on 2019-12-04.
//  Copyright © 2019 Ethan McTague. All rights reserved.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()

}
