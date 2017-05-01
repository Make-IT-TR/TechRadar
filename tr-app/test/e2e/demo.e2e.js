import { PageObject_Welcome } from './welcome.po';
import { PageObject_Skeleton } from './skeleton.po';
import { browser } from 'aurelia-protractor-plugin/protractor';
import { config } from '../protractor.conf';
describe('aurelia skeleton app', function () {
    var po_welcome;
    var po_skeleton;
    beforeEach(function () {
        po_skeleton = new PageObject_Skeleton();
        po_welcome = new PageObject_Welcome();
        browser.loadAndWaitForAureliaPage("http://localhost:" + config.port);
    });
    it('should load the page and display the initial page title', function () {
        expect(po_skeleton.getCurrentPageTitle()).toBe('Welcome | Aurelia');
    });
    it('should display greeting', function () {
        expect(po_welcome.getGreeting()).toBe('Welcome to the Aurelia Navigation App');
    });
    it('should automatically write down the fullname', function () {
        po_welcome.setFirstname('John');
        po_welcome.setLastname('Doe');
        // For now there is a timing issue with the binding.
        // Until resolved we will use a short sleep to overcome the issue.
        browser.sleep(200);
        expect(po_welcome.getFullname()).toBe('JOHN DOE');
    });
    it('should show alert message when clicking submit button', function () {
        expect(po_welcome.openAlertDialog()).toBe(true);
    });
    it('should navigate to users page', function () {
        po_skeleton.navigateTo('#/users');
        browser.sleep(200);
        expect(po_skeleton.getCurrentPageTitle()).toBe('Github Users | Aurelia');
    });
});
