export default function isPhoneNumber(phone: string) {
    const regexp = new RegExp(/^09[0-9]{8}$/);
    return regexp.test(phone);
}
