Czech localization for Kindle Paperwhite 2
============================================

This repository contains all that is needed to build a Czech localization package for Kindle PW2.
It allows submitting translation in pure text files and using SQLite database to adapt the tree for a new
firmware version.

I took a different approach than ixtab & Co.
Instead of adding a new locale, I just 'replaced' en_GB specific files with Czech counterparts.
I know that it is not POSIXly correct but it's safe and easy. Adding new files would be very difficult as
many resources happen to dwell inside CramFS loopback files. One English locale is more than enough for a
non-English speaking user anyway.

I've used Sir Alex' K3Translator to inject Czech phrases into the JARs instead of the British ones. It's
very similar to K3 localization process.
To be on the safe side I don't overwrite stock files and dirs but bind-mount the Czech replacement instead.
The only addition to the system is a simple upstart config file that performs the bindings listed in
userstore.
This approach should work on all Kindle models, even Touch and Paperwhite 1 but I can't localize these
because I don't own any of them.

I'm looking for volunteers brave enough to test the localization or able to help with translation.
When the Czech localization is ready I will be prepared to help with localizing to other languages.


Here's a FAQ in Czech, you can safely ignore it if you can't speak Czech:

----

##FAQ##

###1. Jak mohu přispět###

Potřebuji pomoci jednak s překladem (k tomu stačí dobrá znalost angličtiny a češtiny + práce s čistě textovými soubory na PC) a také s testováním přímo na Kindlu (k čemuž stačí pouze šťouravost a malý kousek odvahy).


###2. Je možné po experimentech vrátit čtečku do původního stavu?###

Ano je. Jediné co v systému přibude bude jailbreak (tj. jeden soubor s certifikátem navíc) a zavaděč lokalizace (opět jeden soubor navíc).
Obojí bude možné odinstalovat.


###3. Nepřijdu o záruku?###

Ne. Amazon vrácené Kindly nijak nezkoumá a v aktuálních reklamačních podmínkách se žádný zákaz manipulace s firmwarem nevyskytuje.
Jedině snad český prodejce by mohl zásah do firmware použít jako záminku pro neuznání reklamace - ale to by se to musel nejdříve nějak dozvědět. I to by však bylo po právní stránce velice sporné, zvlášť pokud byste reklamovali fyzickou závadu.


###4. Jakým způsobem přispět k překladu?###

Překlad i vše co je potřeba k tvorbě lokalizačního balíčku je na GitHubu: https://github.com/dsmid/kindle-pw2-l10n-cs
Stačí si tam založit účet a vytvořit svůj fork projektu. Pak je možné editovat překlady buď přímo na webu nebo u sebe v počítači.
Pokud budete pracovat na webu, ujistěte se prosím, že máte v editoru nastaven Indent mode na Tabs, ne Spaces.
GitHub klient pro Windows se dá stáhnout [tady](http://windows.github.com/), fungují samozřejmě i běžné nástroje pro práci s gitem.
Každou změnu (tzv. commit) můžete sloučit s hlavním repozitářem (pull request). Doporučuji posílat pull requesty často, aby se nestalo, že budou dva lidé pracovat na překladu stejných frází.

Hlavní část překladu je možné nalézt v adresáři [translation_5.4.2/translation](translation_5.4.2/translation)
Je tam poměrně košatý strom souborů s příponou .translation .
Ty mají následující formát:

```
<fráze v angličtine><TAB><fráze v češtině>
<fráze v angličtine><TAB><fráze v češtině>
...
```

Příklad: [translation_5.4.2/translation/com/amazon/agui/swing/resources/ComponentResources_en_GB.translation](translation_5.4.2/translation/com/amazon/agui/swing/resources/ComponentResources_en_GB.translation)

```<TAB>``` je ASCII znak 09h, tj. tabelátor, není možné místo něj použít mezery a na každé řádce by měl být pouze jednou. Pokud chybí český překlad, ve výsledku se zachová anglický výraz.

Tj. stačí dále už jen stačí procházet strom, nalézat soubory s příponou .translation a v nich nepřeložené hlášky.
V tom může pomoci [index nepřeložených hlášek](translation_5.4.2/translation_unfinished/nottranslated.zip) (```View raw``` pro stáhnutí).
