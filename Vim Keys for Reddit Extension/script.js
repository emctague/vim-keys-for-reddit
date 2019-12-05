/*
 script.js
 Vim Keys for Reddit Extension
 Created by Ethan McTague on 2019-12-04.
 
 
 Copyright (C) 2019 Ethan McTague
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

if (window.parent == window.top) {

    /* Represents a single reddit "thing" (comment, post, or 'more comments' link).
     * Provides a simple interface to control this thing.
     */
    class VimKeysElement {
        
        /* Locate elements belonging to Element 'parent', returning the list.
         * If 'parent' is null, finds root-level elements.
         */
        static locateElements(parent, controller) {
            const selObj = parent ? parent.getNode() : document;
            
            const selPart = ".sitetable>.thing[id]:not(.promotedlink)";
            
            const fullSel = parent ? `:scope>.child>${selPart}`
                                 : `.linklisting${selPart}, .nestedlisting${selPart}`;
            
            const output = Array.from(selObj.querySelectorAll(fullSel))
                                .map(item => new VimKeysElement(item.id, controller));
            
            /* Build the immediate next and immediate previous element list.
             * The last element's immediate next is not set here, as it is set instead
             * by the parent when it receives its own next element.
             */
            for (const i in output) {
                const j = parseInt(i);
                
                if (j === 0) output[j].setImmediatePrevious(parent);
                else output[j].setImmediatePrevious(output[j - 1]);
                
                if (j < output.length - 1) output[j].setImmediateNext(output[j + 1]);
            }
            
            return output;
        }
        
        /*
         Members:
         
        _id                 DOM ID of this element
        _controller         Instance of VimKeys class that controls this element
        _next               Next element, including at lower levels
        _previous           Previous element, including at lower levels
        _immediateNext      Next element on same or parent level
        _immediatePrevious  Previous element on same or parent level
        _validWhen          Controller ActiveState for which this element is valid
        _type               "Post", "Comment", "More"
        _children           Child elements, if applicable
        */
        
        /* Construct an element, which may have child elements.
         * `id` is the DOM element ID for this thing
         * `controller` is the VimKeys instance.
         */
        constructor(id, controller) {
            this._id = id;
            this._controller = controller;
            this._validWhen = this._controller.getActiveState();
            this._previous = null;
            this._immediatePrevious = null;
            this._next = null;
            this._immediateNext = null;
            
            console.log(this._id);
            const node = this.getNode();
            
            this._type = node.classList.contains("comment") ? "Comment" :
                         node.classList.contains("morechildren") ? "More" :
                         "Post";
            
            
            this._children = VimKeysElement.locateElements(this, this._controller);
            if (this._children.length) this._next = this._children[0];
            
            node.querySelector(".top-matter, .entry").addEventListener("click", _ => this.makeFocused());
                        
            if (this._type === "More") {
                /* Rebuild node tree when necessary. */
                node.addEventListener('DOMNodeRemoved', () => {
                      if (this.isValid()) this._controller.updateTree(this.getPrevious());
                });
            }
        }
        
        /* Set up the immediate next element for this element. */
        setImmediateNext(next) {
            this._immediateNext = next;
            if (this._children.length) {
                this._children[this._children.length - 1].setImmediateNext(next);
            }
        }
        
        /* Set up the immediate previous element for this element. */
        setImmediatePrevious(previous) {
            this._immediatePrevious = previous;
        }
        
        /* Check if this element is still valid. */
        isValid() {
            return this._validWhen === this._controller.getActiveState();
        }
        
        /* Make this element the actively focused element. */
        makeFocused() {
            if (this._controller.getActiveState() == this._validWhen) {
                this._controller.setFocusedElement(this);
            }
        }
        
        /* Set up the 'next' element for this element. */
        setNext(next) {
            this._next = next;
        }
        
        /* Set up the previous element for this element. */
        setPrevious(previous) {
            this._previous = previous;
        }
        
        /* Obtain the DOM node for this element. */
        getNode() {
            return document.querySelector('#' + this._id);
        }
        
        /* Obtain the previous valid (non-hidden) element. */
        getPrevious() {
            if (this._immediatePrevious && this._immediatePrevious.isCollapsed())
                return this._immediatePrevious;
            else
                return this._previous;
        }
        
        /* Obtain the next valid (non-hidden) element. */
        getNext() {
            return this.isCollapsed() ? this._immediateNext : this._next;
        }
        
        /* Obtain the next element at the same level or parent level. */
        getImmediateNext() {
            return this._immediateNext || this._next;
        }
        
        /* Obtain the previous element at the same level of parent level. */
        getImmediatePrevious() {
            return this._immediatePrevious || this._previous;
        }
        
        /* Check if this element is currently hidden. */
        isCollapsed() {
            return this.getNode().matches(".collapsed, .collapsed *");
        }
        
        /* Get the DOM ID of this element. */
        getID() {
            return this._id;
        }
        
        /* Find the child element (or THIS ELEMENT) with the given ID. */
        findChild(id) {
            if (this.getID() === id) return this;
            
            for (let node of this._children) {
                let found = node.findChild(id);
                if (found) return found;
            }
            
            return null;
        }
        
        /* Upvote this element if applicable. */
        upvote() {
            this.getNode().querySelector(".arrow.up, .arrow.upmod").click();
        }
        
        /* Downvote this element if applicable. */
        downvote() {
            this.getNode().querySelector(".arrow.down, .arrow.downmod").click();
        }
        
        /* Expand or unexpand this element.
         * If this element is a "load more comments" link, it will trigger
         * a total re-build of Vim Keys for Reddit's element tree. */
        toggleExpand() {
            this.getNode()
                .querySelector(this._type === "More" ? "a" : ".expando-button, .expand")
                .click();
        }
        
        /* Obtain the comment URL of this element if applicable. */
        getCommentURL() {
            return this.getNode().querySelector("a.bylink").href;
        }
        
        /* Obtain the link URL of this element unless it's the same as the comment URL */
        getLinkURL() {
            const link = this.getNode().querySelector("a.title").href;
            const comment = this.getCommentURL();
            if (link !== comment) return link;
        }
        
        /* Convert to a flat list containing this element and all children. */
        flatten() {
            return [this].concat(this._children.map(child => child.flatten()).flat());
        }
    }

    
    /* Controls the tree of Elements ('things') and handles navigation between them.
     */
    class VimKeys {
        
        /* Initialize the tree. */
        setup() {
            this._activeState = 0;
            this.updateTree();
            document.addEventListener("keydown", e => this.handleKeyPress(e));
        }
        
        /* ActiveState is a variable that is incremented whenever the tree is rebuilt.
         * Allows old event handlers to be invalidated. */
        getActiveState() {
            return this._activeState;
        }
        
        /* Rebuild the tree of elements. If newFocus is set, it is the Element that should
         * be focused on after rebuilding, if it still exists. */
        updateTree(newFocus) {
            this._activeState++;
            this._elements = VimKeysElement.locateElements(null, this);
            
            /* Set up the next/previous element list. */
            const flatList = this._elements.map(e => e.flatten()).flat();
            for (let i = 0; i < flatList.length; i++) {
                if (i != 0) flatList[i].setPrevious(flatList[i - 1]);
                if (i != flatList.length - 1) flatList[i].setNext(flatList[i + 1]);
            }
            
            /* Set focus on an element based on the previous element tree. */
            if (newFocus) {
                for (let element of this._elements) {
                    let found = element.findChild(newFocus.getID());
                    if (found) {
                        found.makeFocused();
                        return;
                    }
                }
            }
            
            if (this._elements.length > 0)
                this._elements[0].makeFocused();
        }
       
        /* Updates the internal focused element variable and styling on the focused
         * element. SHOULD ONLY BE CALLED FROM Element's makeFocused method.
         * DO NOT CALL DIRECTLY.
         */
        setFocusedElement(element) {
            if (this._focusedElement) {
                this._focusedElement.getNode().classList.remove("res-selected");
            }
            
            this._focusedElement = element;
            const node = this._focusedElement.getNode();
            node.classList.add("res-selected");
            /* Ensures the important parts of the element (content and tagline) are visible.
             * Neither of these reliably scrolls the whole element into view on its own. */
            node.querySelector(".entry").scrollIntoViewIfNeeded(false);
            node.querySelector(".tagline").scrollIntoViewIfNeeded(false);
        }
        
        /* Handle key events globally. */
        handleKeyPress(e) {
            if (['input, textarea'].includes(e.target.nodeName.toLowerCase()))
                return;
            
            /* Maps keys to functions that handle their presses.
             * Argument passed is the actively focused element. */
            const handlers = {
                "j": f => f.getNext().makeFocused(),
                "J": f => f.getImmediateNext().makeFocused(),
                "k": f => f.getPrevious().makeFocused(),
                "K": f => f.getImmediatePrevious().makeFocused(),
                "a": f => f.upvote(),
                "A": f => f.upvote(),
                "z": f => f.downvote(),
                "Z": f => f.downvote(),
                "x": f => f.toggleExpand(),
                "c": f => window.location.href = f.getCommentURL(),
                "C": f => this.openNewTab(f.getCommentURL()),
                "l": f => {
                    this.openNewTab(f.getCommentURL());
                    this.openNewTab(f.getLinkURL());
                }
            };
            
            if (handlers[e.key]) handlers[e.key](this._focusedElement);
        }
        
        /* Open a link in a new tab, if the provided URL is not null. */
        openNewTab(url) {
            if (url) safari.extension.dispatchMessage("openNewTab", {url});
        }
    }

    document.addEventListener("DOMContentLoaded", () => new VimKeys().setup());
}
